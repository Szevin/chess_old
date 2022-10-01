import { io } from 'socket.io-client'
import { useAppDispatch } from '..'
import Position from '../../models/Position'
import { Move, setBoard } from '../redux/board'

const socket = io('http://localhost:3030')

export const useSocket = () => {
  const dispatch = useAppDispatch()

  socket.on('connect', () => {
    console.log('connected')
  })

  socket.on('board', (board) => {
    dispatch(setBoard(board))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (id: string) => {
    socket.emit('join', id)
  }

  return { move, join }
}
