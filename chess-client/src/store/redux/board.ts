/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Board } from 'chess-common'

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
      const board = Object.assign(new Board(action.payload._id, action.payload.pieces, true), action.payload)
      board.currentPlayer = action.payload.currentPlayer
      Object.assign(state, board)
    },
  },
})

export const { setBoard } = boardSlice.actions
export default boardSlice.reducer
