
import { IUser, Board } from 'chess-common'
import { SocketType, IoType } from '..'
import { BoardModel } from '../models/Board.js'
import { scoreBoard } from './handleMove.js'

export async function handleTimesover({ boardId, color }: { boardId: string, color: 'white' | 'black' }, socket: SocketType, io: IoType) {
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

    if (!board || board.status !== 'playing') return

    board.isCheckmate = true
    board.currentPlayer = color
    board.save()

    await scoreBoard(boardId)

    board = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>(['white', 'black'])
    console.log(`Times over for ${board[color].name} on board ${boardId}`)

    io.to(boardId).emit('board', Object.assign(new Board(boardId), board.toObject()))
}
