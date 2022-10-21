import { io } from 'socket.io-client'
import { Board, Move } from 'chess-common'
import useSound from 'use-sound'
import { useAppDispatch, useAppSelector } from '..'
import { setBoard } from '../redux/board'
import commonSound from '../../assets/sounds/common.mp3'

const socket = io('http://localhost:3030')

export const useSocket = () => {
  // play message notification sound
  const [playSound] = useSound(commonSound, { volume: 0.1 })
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)
  const board = useAppSelector((state) => state.board)

  socket.on('board', (board: Board) => {
    playSound()
    dispatch(setBoard(board))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const join = (boardId: string) => {
    socket.emit('join', { boardId, userId: user._id ?? socket.id })
  }

  const leave = (boardId: string) => {
    socket.emit('leave', { boardId, userId: user._id ?? socket.id })
  }

  const message = (content: string) => {
    socket.emit('message', { content, boardId: board._id, userId: user._id })
  }

  return { move, join, message, leave }
}
