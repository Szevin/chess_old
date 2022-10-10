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

interface ServerToClientEvents {
  board: (board: Board) => void;
}

interface ClientToServerEvents {
  move: (move: Move) => void;
  join: ({boardId, user}: { boardId: string, user: string }) => void;
  message: ({ content, user }: { content: string, user: string }) => void;
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

let boards: Board[] = []

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('join', ({ boardId, user }) => {
    if (!boards.find(board => board.id === boardId)) {
      boards.push(new Board(boardId))
    }
    const board  = boards.find(board => board.id === boardId)
    socket.join(boardId)

    if (board.players.find(player => player === user)) {
      socket.emit('board', board)
      return
    }


    if (board.players.length >= 2) {
      if(board.spectators.find(spectator => spectator === socket.id))
        return

      console.log(`${user} spectating ${boardId}`)
      board.spectators.push(socket.id)
      io.to(board.id).emit('board', board)
      return
    }

    board.players.push(user)
    io.to(board.id).emit('board', board)
    console.log(`${user} playing ${boardId}`);
  })

  socket.on('move', (move) => {
    const board = boards.find(board => board.players.includes(move.player))
    if (!board) throw Error(`Board not found for ${move.player}`)
    if (!board.pieces.some(piece => piece.moves.valid.some((valid) => valid == move.to))) throw Error(`Invalid Move: ${move.piece}${move.from}-${move.to}, not found on board ${board.id}`)

    board.handleMove(move)
    io.to(board.id).emit('board', board)
  })

  socket.on('message', ({content, user}) => {
    const board = boards.find(board => board.players.includes(user))
    if (!board) return

    board.messages.push({
      content,
      user,
      id: uuid.v4(),
      timestamp: Date.now(),
    } as Message)
    io.to(board.id).emit('board', board)
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    boards = boards.map(board => {
        // board.players = board.players.filter((player) => player !== user)
        board.spectators = board.spectators.filter((spectator) => spectator !== socket.id)
        io.to(board.id).emit('board', board)
      return board
    })
  }
  )
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
