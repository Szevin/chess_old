/* eslint-disable no-param-reassign */
import { io } from 'socket.io-client'
import { Board, Move } from 'chess-common'
import { useAppDispatch, useAppSelector } from '..'
import { setBoard } from '../redux/board'

const socket = io('http://localhost:3030')

export const useSocket = () => {
  // play message notification sound
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)
  const board = useAppSelector((state) => state.board)

  socket.on('board', (board: Board) => {
    if (Object.values(board.pieces).some((piece) => piece.hidden)) {
      let piecesArray = Object.values(board.pieces)
      const hiddenColor = board.white._id === user._id ? 'black' : board.black._id === user._id ? 'white' : null
      piecesArray = piecesArray.map((piece) => {
        if (piece.color !== hiddenColor) {
          piece.hidden = false
        } else {
          piece.hidden = true
        }
        return piece
      })

      board.pieces = Object.fromEntries(piecesArray.map((piece) => [piece.position, piece]))
    }
    dispatch(setBoard(board))
  })

  const move = (move: Move) => {
    socket.emit('move', move)
  }

  const timesover = (color: 'white' | 'black') => {
    socket.emit('timesover', { boardId: board._id, color })
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

  return { move, timesover, join, message, leave }
}
