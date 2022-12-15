/* eslint-disable no-param-reassign */
import { io } from 'socket.io-client'
import { Board, Move } from 'chess-common'
import React from 'react'
import { useAppDispatch, useAppSelector } from '..'
import { setBoard } from '../redux/board'

const socket = io('http://localhost:3030')

export const useSocket = () => {
  // play message notification sound
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user)
  const board = useAppSelector((state) => state.board)

  React.useEffect(() => {
    socket.on('board', (incomingBoard: Board) => {
      console.log(incomingBoard)
      if (Object.values(incomingBoard.pieces).some((piece) => piece.hidden)) {
        let piecesArray = Object.values(incomingBoard.pieces)
        const hiddenColor = incomingBoard.white._id === user._id ? 'black' : incomingBoard.black._id === user._id ? 'white' : null
        piecesArray = piecesArray.map((piece) => {
          if (piece.color !== hiddenColor) {
            piece.hidden = false
          } else {
            piece.hidden = true
          }
          return piece
        })

        incomingBoard.pieces = Object.fromEntries(piecesArray.map((piece) => [piece.position, piece]))
      }
      dispatch(setBoard(incomingBoard))
    })
  }, [socket])

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
