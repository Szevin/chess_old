import { Board, Message, Move } from 'chess-common';
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
    if (!mongoose.isValidObjectId(boardId)) {
      return;
    }

    if (!BoardModel.findById(boardId)) {
      console.log('Board not found');
      return;
    }
    const board  = await BoardModel.findById(boardId)
    await socket.join(boardId)

    if (board.white === user || board.black === user) {
      socket.emit('board', Object.assign(new Board(board._id), board))
      return
    }


    if (board.white && board.black) {
      console.log('Board is full');
      if(board.spectators.find(spectator => spectator === socket.id))
        return

      console.log(`${user} spectating ${boardId}`)
      board.spectators.push(socket.id)
      io.to(board._id).emit('board', board)
      return
    }

    if (!(await UserModel.findById(user))) {
      console.log('User not logged in');
      return
    }

    board.white ? board.black = user : board.white = user
    console.log(board._id)
    io.to(boardId).emit('board', Object.assign(new Board(board._id), board))
    console.log(`${user} playing ${boardId}`);
    console.log(io.sockets.adapter.rooms)
  })

  socket.on('move', async (move) => {
    const board = await BoardModel.findById(move.boardId)
    if (!board) throw Error(`Board not found for ${move.player}`)
    if (!board.pieces.some(piece => piece.moves.valid.some((valid) => valid == move.to))) throw Error(`Invalid Move: ${move.piece}${move.from}-${move.to}, not found on board ${board._id}`)

    board.handleMove(move)
    await board.save()
    io.to(board._id).emit('board', board)
  })

  socket.on('message', async ({content, user, boardId}) => {
    const board = await BoardModel.findById(boardId)
    if (!board) return

    board.messages.push({
      content,
      user,
      id: uuid.v4(),
      timestamp: Date.now(),
    } as Message)
    await board.save()
    io.to(board._id).emit('board', board)
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    // boards = boards.map(board => {
    //     // board.players = board.players.filter((player) => player !== user)
    //     board.spectators = board.spectators.filter((spectator) => spectator !== socket.id)
    //     io.to(board._id).emit('board', board)
    //   return board
    // })
  }
  )
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
