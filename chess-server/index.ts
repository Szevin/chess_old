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

// import boardRoute from './api/routes/board.js';
// import userRoute from './api/routes/user.js';

dotenv.config()
const port = process.env.PORT ?? 3030
const app = express()

mongoose.connect(process.env.ATLAS_URL ?? '').catch(err => {
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
// app.use('/api/user', userRoute)
// app.use('/api/board', boardRoute)

interface ServerToClientEvents {
  board: (board: Board) => void;
}

interface ClientToServerEvents {
  move: (move: Move) => void;
  join: (id: string) => void;
  message: (message: string) => void;
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

  socket.on('join', (id) => {
    if (!boards.find(board => board.id === id)) {
      boards.push(new Board(id))
    }
    const board  = boards.find(board => board.id === id)
    socket.join(id)

    if (board.players.find(player => player === socket.id)) return


    if (board.players.length >= 2) {
      if(board.spectators.find(spectator => spectator === socket.id)) return

      console.log(`${socket.id} spectating ${id}`)
      board.spectators.push(socket.id)
      io.to(board.id).emit('board', board)
      return
    }

    board.players.push(socket.id)
    io.to(board.id).emit('board', board)
    console.log(`${socket.id} playing ${id}`);
  })

  socket.on('move', (move: Move) => {
    const board = boards.find(board => board.players.includes(socket.id))
    if (board) {
      board.handleMove(move)
      io.to(board.id).emit('board', board)
    }
  })

  socket.on('message', (message: string) => {
    const board = boards.find(board => board.players.includes(socket.id))
    if (board) {
      board.messages.push({
        content: message,
        user: String(board.players.indexOf(socket.id)),
        id: uuid.v4(),
        timestamp: Date.now(),
      })
      io.to(board.id).emit('board', board)
    }
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    boards = boards.map(board => {
      if (board.players.includes(socket.id)) {
        board.players = board.players.filter((player) => player !== socket.id)
        io.to(board.id).emit('board', board)
      }
      return board
    })
  }
  )
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
