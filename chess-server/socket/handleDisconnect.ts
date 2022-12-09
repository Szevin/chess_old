import { Board } from 'chess-common';
import { SocketType, IoType } from '..';
import { BoardModel } from '../models/Board.js';

export async function handleDisconnect(socket: SocketType, io: IoType) {
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
}
