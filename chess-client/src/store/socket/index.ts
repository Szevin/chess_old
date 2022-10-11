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
    console.log('board', board)
    dispatch(setBoard(board))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (boardId: string) => {
    socket.emit('join', { boardId, user: user._id })
  }

  const message = (content: string) => {
    socket.emit('message', { content, user: user._id, boardId: board._id })
  }

  return { move, join, message }
}
