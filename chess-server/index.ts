import { Board, Message, Move, Piece } from 'chess-common';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import * as uuid from 'uuid';

import userRoute from './routes/User.js';
import boardRoute from './routes/Board.js';
import { BoardModel } from './models/Board.js';
import { UserModel } from './models/User.js';
import { ColorType } from 'chess-common/lib/Piece.js';

dotenv.config()
const port = process.env.PORT ?? 3030
const app = express()

mongoose.connect(process.env.MONGODB_URI).catch(err => {
  console.error(err)
})

app.use(express.json());
app.use(cors());
export const server = new http.Server(app);

//Swagger Info
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chess Server',
      version: '1.0.0',
    },
  },
  apis: ['./api/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//END Swagger Info

//REGISTER ROUTES
app.use('/api/user', userRoute)
app.use('/api/board', boardRoute)

interface ServerToClientEvents {
  board: (board: Board) => void;
}

interface ClientToServerEvents {
  move: (move: Move) => void;
  join: ({boardId, user}: { boardId: string, user: string }) => void;
  leave: ({boardId, user}: { boardId: string, user: string }) => void;
  message: ({ content, user, boardId }: { content: string, user: string, boardId: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('join', async ({ boardId, user }) => {


    const board  = await BoardModel.findOne({ id: boardId })
    if (!board) {
      console.log('Board not found!');
      return;
    }
    await socket.join(board.id)

    if (board.white === user || board.black === user) {
      socket.emit('board', Object.assign(new Board(board.id), board.toObject()))
      return
    }

    if (board.white && board.black) {
      console.log('Board is full!');
      if(board.spectators.find(spectator => spectator === socket.id)) {
        io.to(board.id).emit('board', board)
        return
      }

      console.log(`${user} spectating ${board.id}`)
      board.spectators.push(socket.id)
      await board.save()
      io.to(board.id).emit('board', board)
      return
    }

    if (!(await UserModel.findOne({ name: user }))) {
      console.log('User not logged in!');
      return
    }

    if(!board.white) {
      board.white = user
    } else if(!board.black) {
      board.black = user
    }

    if (board.white && board.black) {
      board.status = 'playing'
    }
    await board.save()
    io.to(board.id).emit('board', Object.assign(new Board(board.id), board.toObject()))
    console.log(`${user} playing ${board.id}`);
  })

  socket.on('move', async (move) => {
    const board = await BoardModel.findOne({id: move.boardId})
    if (!board) throw Error(`Board not found for ${move.player}`)
    if(board.status !== 'playing') throw Error(`Board not playing for ${move.player}`)
    if (!board.pieces.some(piece => piece.moves.valid.some((valid) => piece.position === move.from && piece.name === move.piece && valid == move.to))) throw Error(`Invalid Move: ${move.piece}${move.from}-${move.to}, not found on board ${board.id}`)

    const boardClass = Object.assign(new Board(board.id), board.toObject())
    boardClass.pieces = boardClass.pieces.map((piece) => Object.assign(new Piece('pawn', 'black', 'a1'), piece))
    boardClass.handleMove(move)

    board.pieces = boardClass.pieces
    board.status = boardClass.status
    board.currentPlayer = boardClass.currentPlayer
    board.moves = boardClass.moves
    board.isCheck = boardClass.isCheck
    board.isCheckmate = boardClass.isCheckmate
    board.isStalemate = boardClass.isStalemate

    if(board.isCheckmate || board.isStalemate) scoreBoard(move.boardId)

    await board.save()
    io.to(board.id).emit('board', boardClass)
  })

  socket.on('message', async ({content, user, boardId}) => {
    const board = await BoardModel.findOne({id: boardId})
    if (!board) throw Error(`Board not found for ID ${boardId}`)
    if (board.white !== user && board.black !== user) throw Error(`User ${user} not playing on board ${boardId}`)
    if (board.status !== 'playing') throw Error(`Board not playing for ${user}`)

    board.messages.push({
      content,
      user,
      id: uuid.v4(),
      timestamp: Date.now(),
    } as Message)
    await board.save()
    io.to(board.id).emit('board', Object.assign(new Board(board.id), board.toObject()))
  })

  socket.on('leave', async ({boardId, user}) => {
    const board = await BoardModel.findOne({id: boardId})
    if (!board) return

    board.spectators = board.spectators.filter(spectator => spectator !== socket.id)
    board.save()
    socket.leave(board.id)
    io.to(board.id).emit('board', Object.assign(new Board(board.id), board.toObject()))
    console.log(`${user} left ${board.id}`);
  })

  socket.on('disconnect', async () => {
    console.log(`Socket ${socket.id} disconnected`);

    const boards = await BoardModel.find({spectators: socket.id})

    boards.forEach(async (board) => {
      board.spectators = board.spectators.filter(spectator => spectator !== socket.id)
      await board.save()
      io.to(board.id).emit('board', Object.assign(new Board(board.id), board.toObject()))
    })
  })
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const scoreBoard = async (boardId: string) => {
  const board = await BoardModel.findOne({id: boardId})

  if(board.isCheckmate) {
    board.status = 'finished'
    board.winner = (board.currentPlayer === 'white' ? board.black : board.white) as ColorType
    const winnerPlayer = await UserModel.findOne({ name: board[board.winner] })
    const loserPlayer = await UserModel.findOne({ name: board[board.currentPlayer] })

    if(!winnerPlayer || !loserPlayer) throw Error('Winner or loser not found!')

    winnerPlayer.wins += 1
    const winnerExpectedScore = 1 / (1 + 10 ** ((loserPlayer.elo - winnerPlayer.elo) / 400))
    winnerPlayer.elo += 32 * (1 - winnerExpectedScore)
    winnerPlayer.streak += 1
    winnerPlayer.save()

    loserPlayer.losses += 1
    const loserExpectedScore = 1 / (1 + 10 ** ((winnerPlayer.elo - loserPlayer.elo) / 400))
    loserPlayer.elo += 32 * (0 - loserExpectedScore)
    loserPlayer.streak = 0
    loserPlayer.save()
  }

  if(board.isStalemate) {
    board.status = 'finished'
    board.winner = 'draw'

    const whitePlayer = await UserModel.findOne({ name: board.white })
    const blackPlayer = await UserModel.findOne({ name: board.black })

    if(!whitePlayer || !blackPlayer) throw Error('White or black not found!')

    whitePlayer.draws += 1
    const whiteExpectedScore = 1 / (1 + 10 ** ((blackPlayer.elo - whitePlayer.elo) / 400))
    whitePlayer.elo += 32 * (0.5 - whiteExpectedScore)
    whitePlayer.streak = 0
    whitePlayer.save()

    blackPlayer.draws += 1
    const blackExpectedScore = 1 / (1 + 10 ** ((whitePlayer.elo - blackPlayer.elo) / 400))
    blackPlayer.elo += 32 * (0.5 - blackExpectedScore)
    blackPlayer.streak = 0
    blackPlayer.save()
  }
}
