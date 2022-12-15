import { Board, Move } from 'chess-common';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';

import userRoute from './routes/User.js';
import boardRoute from './routes/Board.js';
import { handleMove } from './socket/handleMove.js';
import { handleJoin } from './socket/handleJoin.js';
import { handleMessage } from './socket/handleMessage.js';
import { handleLeave } from './socket/handleLeave.js';
import { handleDisconnect } from './socket/handleDisconnect.js';
import { handleTimesover } from './socket/handleTimesover.js';

dotenv.config()
const port = process.env.PORT ?? 3030
const app = express()

mongoose.connect(process.env.MONGODB_URI).catch(err => {
  console.error(err)
})

app.use(express.json());
app.use(cors());
export const server = new http.Server(app);

//REGISTER ROUTES
app.use('/api/user', userRoute)
app.use('/api/board', boardRoute)

interface ServerToClientEvents {
  board: (board: Board) => void;
}

interface ClientToServerEvents {
  move: (move: Move) => void;
  timesover: ({ boardId, color }: { boardId: string, color: 'white' | 'black' }) => void;
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

export type IoType = typeof io
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('join', async ({ boardId, userId }) => {
    handleJoin({ boardId, userId }, socket, io)
  })

  socket.on('move', (move) => {
    handleMove(move, io)
  })

  socket.on('timesover', ({ boardId, color }) => {
    handleTimesover({ boardId, color }, socket, io)
  })

  socket.on('message', async ({content, boardId, userId}) => {
    handleMessage({content, boardId, userId}, io)
  })

  socket.on('leave', async ({boardId, userId}) => {
    handleLeave({boardId, userId}, socket, io)
  })

  socket.on('disconnect', async () => {
    handleDisconnect(socket, io)
  })
})

io.listen(server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
