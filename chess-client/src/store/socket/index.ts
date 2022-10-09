import { io } from 'socket.io-client'
import { Move } from 'chess-common'
import { useAppDispatch } from '..'
import { setBoard } from '../redux/board'

const socket = io(process.env.SERVER_URL ?? 'http://localhost:3030')

export const useSocket = () => {
  const dispatch = useAppDispatch()

  const user = sessionStorage.getItem('user') ?? ''

  socket.on('board', (board) => {
    dispatch(setBoard({
      ...board,
      messages: board.players.includes(user) ? board.messages : [],
    }))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (boardId: string) => {
    socket.emit('join', { boardId, user })
  }

  const message = (content: string) => {
    socket.emit('message', { content, user })
  }

  return { move, join, message }
}
