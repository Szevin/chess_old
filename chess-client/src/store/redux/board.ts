/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Annotation, Board, Piece } from 'chess-common'

const initialState = {
  _id: '',
  white: '',
  black: '',
  spectators: [],
  moves: [],
  messages: [],
  status: 'waiting',
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  currentPlayer: '',
} as unknown as Board

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<Board>) {
      const board = Object.assign(new Board(action.payload._id.toString()), action.payload)
      board.pieces = {}
      Object.values(action.payload.pieces).forEach((piece) => {
        board.pieces[piece.position as Annotation] = Object.assign(new Piece('p', 'a1'), piece)
      })
      board.currentPlayer = action.payload.currentPlayer
      Object.assign(state, board)
    },

    clearBoard(state) {
      Object.assign(state, initialState)
    },
  },
})

export const { setBoard, clearBoard } = boardSlice.actions
export default boardSlice.reducer
