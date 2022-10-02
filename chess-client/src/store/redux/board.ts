/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Board, Move } from 'chess-common'

const initialState = {
  id: '',
  name: '',
  players: [],
  spectators: [],
  moves: [],
  pieces: [],
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  currentPlayer: '',
} as unknown as Board

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addMove(state, action: PayloadAction<Move>) {
      state.moves.push(action.payload)
    },
    setBoard(state, action: PayloadAction<Board>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { addMove, setBoard } = boardSlice.actions
export default boardSlice.reducer
