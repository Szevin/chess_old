import { io } from 'socket.io-client'
import { Move } from 'chess-common'
import { useAppDispatch } from '..'
import { setBoard } from '../redux/board'

const socket = io(process.env.SERVER_URL ?? 'http://localhost:3030')

export const useSocket = () => {
  const dispatch = useAppDispatch()
  const user = socket.id

  socket.on('board', (board) => {
    dispatch(setBoard({
      ...board,
      messages: board.players.includes(user) ? board.messages : [],
    }))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (id: string) => {
    socket.emit('join', id)
  }

  const message = (message: string) => {
    socket.emit('message', message)
  }

  return { move, join, message, user }
}
