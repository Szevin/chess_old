import { io } from 'socket.io-client'
import { Board, Move } from 'chess-common'
import { useAppDispatch, useAppSelector } from '..'
import { setBoard } from '../redux/board'

const socket = io(process.env.SERVER_URL ?? 'http://localhost:3030')

export const useSocket = () => {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)
  const board = useAppSelector((state) => state.board)

  socket.on('board', (board: Board) => {
    dispatch(setBoard(board))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (boardId: string) => {
    socket.emit('join', { boardId, user: user.name })
  }

  const leave = (boardId: string) => {
    socket.emit('leave', { boardId, user: user.name })
  }

  const message = (content: string) => {
    socket.emit('message', { content, user: user.name, boardId: board.id })
  }

  return { move, join, message, leave }
}
