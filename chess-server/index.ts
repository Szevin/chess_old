import { Annotation, Board, ChessStats, IUser, Message, Move, Piece } from 'chess-common';
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
  join: ({boardId, userId}: { boardId: string, userId: string }) => void;
  leave: ({boardId, userId}: { boardId: string, userId: string }) => void;
  message: ({ content, boardId, userId }: { content: string, boardId: string, userId: string }) => void;
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

  socket.on('join', async ({ boardId, userId }) => {
    const board  = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>([
      {
        path: 'white black',
        model: 'User',
      }, {
        path: 'messages',
        populate: {
          path: 'user',
          model: 'User',
        },
      }
    ])

    if (!board) {
      console.log('Board not found!');
      return;
    }
    await socket.join(boardId)

    try {
      const user = await UserModel.findById(userId)

      if (board.white?._id.toString() === userId || board.black?._id.toString() === userId) {
        console.log(`User ${user.name} is already in the game!`);
        io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
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
      io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
      console.log(`${user.name} playing ${boardId}`);
    } catch (error) {

      console.log(`${userId} spectator joined`);
      board.spectators.push(userId)
      await board.save()
      io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
      return
    }
  })

  socket.on('move', async (move) => {
    let board = await BoardModel.findById(move.boardId).populate<{white: IUser, black: IUser}>([
      {
        path: 'white black',
        model: 'User',
      }, {
        path: 'messages',
        populate: {
          path: 'user',
          model: 'User',
        },
      }
    ])

    if (!board) throw Error(`Board not found for ${move.player}`)
    if(board.status !== 'playing') throw Error(`Board not playing for ${move.player}`)
    if (!Object.values(board.pieces).some(piece => piece.moves.valid.some((valid) => piece.position === move.from && piece.name === move.piece && valid == move.to))) throw Error(`Invalid Move: ${move.piece}${move.from}-${move.to}, not found on board ${move.boardId}`)

    const boardClass = Object.assign(new Board(move.boardId), board.toObject())
    boardClass.pieces = new Map<Annotation, Piece>()
    Object.values(board.pieces).forEach((piece) => {
      boardClass.pieces.set(piece.position, Object.assign(new Piece('p', 'a1'), piece))
    })

    boardClass.handleMove(move)

    board.pieces = new Map<Annotation, Piece>()
    boardClass.pieces.forEach((piece, annotation) => {
      board.pieces.set(annotation, Object.assign(new Piece('p', 'a1'), piece))
    })
    board.status = boardClass.status
    board.currentPlayer = boardClass.currentPlayer
    board.moves = boardClass.moves
    board.isCheck = boardClass.isCheck
    board.isCheckmate = boardClass.isCheckmate
    board.isStalemate = boardClass.isStalemate
    await board.save()

    if (board.isCheckmate || board.isStalemate) await scoreBoard(move.boardId)

    board = await BoardModel.findById(move.boardId).populate<{white: IUser, black: IUser}>(['white', 'black'])

    io.to(move.boardId).emit('board', Object.assign(new Board(move.boardId), board.toObject()))
  })

  socket.on('message', async ({content, boardId, userId}) => {
    let board = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>([
      {
        path: 'white black',
        model: 'User',
      }, {
        path: 'messages',
        populate: {
          path: 'user',
          model: 'User',
        },
      }
    ])

    if (!board) throw Error(`Board not found for ID ${boardId}`)
    if (board.white._id.toString() !== userId && board.black._id.toString() !== userId) throw Error(`User ${userId} not playing on board ${boardId}`)
    if (board.status !== 'playing') throw Error(`Board not playing for ${userId}`)

    board.messages.push({
      content,
      user: userId.toString(),
      boardId: boardId.toString(),
      id: uuid.v4(),
      timestamp: Date.now(),
    } as unknown as Message)
    await board.save()
    board = await board.populate<{white: IUser, black: IUser}>([
      {
        path: 'white black',
        model: 'User',
      }, {
        path: 'messages',
        populate: {
          path: 'user',
          model: 'User',
        },
      }
    ])

    io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
  })

  socket.on('leave', async ({boardId, userId}) => {
    const board = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>([
      {
        path: 'white black',
        model: 'User',
      }, {
        path: 'messages',
        populate: {
          path: 'user',
          model: 'User',
        },
      }
    ])

    if (!board) return

    board.spectators = board.spectators.filter(spectator => spectator !== socket.id)
    board.save()
    socket.leave(boardId)
    io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
    console.log(`${userId} left ${boardId}`);
  })

  socket.on('disconnect', async () => {
    console.log(`Socket ${socket.id} disconnected`);
    try {
      const boards = await BoardModel.find({spectators: socket.id})
      boards.forEach(async (board) => {
        board.spectators = board.spectators.filter(spectator => spectator !== socket.id)
        await board.save()
        io.to(board._id.toString()).emit('board', Object.assign(new Board(board._id.toString()), board.toObject()))
      })
    } catch (error) {
      return
    }
  })
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const scoreBoard = async (boardId: string) => {
  let board = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>([
    {
      path: 'white black',
      model: 'User',
    }, {
      path: 'messages',
      populate: {
        path: 'user',
        model: 'User',
      },
    }
  ])

  if(board.isCheckmate) {
    board.status = 'finished'
    board.winner = board.currentPlayer === 'white' ? board.black : board.white
    board.loser = board.currentPlayer === 'black' ? board.black : board.white

    const winnerPlayer = await UserModel.findById(board.winner._id)
    const loserPlayer = await UserModel.findById(board.loser._id)

    if(!winnerPlayer || !loserPlayer) throw Error('Winner or loser not found!')

    winnerPlayer.stats[board.type] = calculateStats(board.winner.stats[board.type], board.loser.stats[board.type], 1)
    await winnerPlayer.save()

    loserPlayer.stats[board.type] = calculateStats(board.loser.stats[board.type], board.winner.stats[board.type], 0)
    await loserPlayer.save()

    await board.save()
  }

  if(board.isStalemate) {
    board.status = 'finished'
    board.winner = null
    board.loser = null

    const whitePlayer = await UserModel.findById(board.white._id)
    const blackPlayer = await UserModel.findById(board.white._id)

    if(!whitePlayer || !blackPlayer) throw Error('White or black not found!')

    whitePlayer.stats[board.type] = calculateStats(whitePlayer.stats[board.type], blackPlayer[board.type], 0.5)
    await whitePlayer.save()

    blackPlayer.stats[board.type] = calculateStats(blackPlayer.stats[board.type], whitePlayer[board.type], 0.5)
    await blackPlayer.save()

    await board.save()
  }
}

const calculateStats = (prevStats: ChessStats, enemyPrevStats: ChessStats, result: (0 | 0.5 | 1)): ChessStats => {
  const expectedScore = 1 / (1 + 10 ** ((enemyPrevStats.elo - prevStats.elo) / 400))
  const newElo = Math.floor(prevStats.elo + 32 * (result - expectedScore))
  const newStreak = result === 1 ? prevStats.streak + 1 : 0

  return {
    elo: newElo,
    wins: prevStats.wins + (result === 1 ? 1 : 0),
    losses: prevStats.losses + (result === 0 ? 1 : 0),
    draws: prevStats.draws + (result === 0.5 ? 1 : 0),
    streak: newStreak,
  }
}
