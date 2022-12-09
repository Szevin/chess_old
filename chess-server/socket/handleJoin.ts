import { IUser, Board } from 'chess-common';
import { IoType, SocketType } from '..';
import { BoardModel } from '../models/Board.js';
import { UserModel } from '../models/User.js';

export async function handleJoin({ boardId, userId }: { boardId: string, userId: string }, socket: SocketType, io: IoType) {
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
  }
