import { IUser, Message, Board } from 'chess-common'
import { IoType } from '..'
import { BoardModel } from '../models/Board.js'
import * as uuid from 'uuid';

export async function handleMessage({ content, boardId, userId }: { content: string, boardId: string, userId: string }, io: IoType) {
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
}
