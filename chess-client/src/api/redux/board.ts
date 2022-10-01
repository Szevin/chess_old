/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Annotation } from '../../models/Position'
import Piece from '../../models/Piece'

interface IBoard {
  id: string;
  name: string;
  players: string[];
  spectators: string[];
  moves: Move[];
  pieces: Piece[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  currentPlayer: string;
}

export const getPiece = (board: IBoard, at: Annotation) => board.pieces.find((piece) => piece.position === at)

export interface Move {
  from: Annotation;
  to: Annotation;
  piece: string;
}

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
} as IBoard

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addMove(state, action: PayloadAction<Move>) {
      state.moves.push(action.payload)
    },
    setBoard(state, action: PayloadAction<IBoard>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { addMove, setBoard } = boardSlice.actions
export default boardSlice.reducer
