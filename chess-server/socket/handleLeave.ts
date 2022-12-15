import { IUser, Board } from 'chess-common'
import { SocketType, IoType } from '..'
import { BoardModel } from '../models/Board.js'

export async function handleLeave({ boardId, userId }: { boardId: string, userId: string }, socket: SocketType, io: IoType) {
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

    try {
      board.spectators = board.spectators.filter(spectator => spectator !== socket.id)
    } catch (error) {
      return
    }
    board.save()
    socket.leave(boardId)
    io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
    console.log(`${userId} left ${boardId}`);
}
