import { Board } from 'chess-common';
import mongoose, { Schema } from 'mongoose';
import { v1 } from 'uuid';

const BoardSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.String,
    required: true,
  },
  white: {
    type: Schema.Types.String,
    ref: 'User',
    required: false,
  },
  black: {
    type: Schema.Types.String,
    ref: 'User',
    required: false,
  },
  moves: [
    {
      type: Object,
      required: true,
    },
  ],
  messages: [
    {
      type: Object,
      required: true,
    },
  ],

  winner: {
    type: Schema.Types.String,
    ref: 'User',
    required: false,
  },
  isCheck: {
    type: Schema.Types.Boolean,
    required: true,
  },
  isCheckmate: {
    type: Schema.Types.Boolean,
    required: true,
  },
  isStalemate: {
    type: Schema.Types.Boolean,
    required: true,
  },

  currentPlayer: {
    type: Schema.Types.String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  spectators: [
    {
      type: String,
      required: true,
    },
  ],
  pieces: [
    {
      type: Object,
      required: true,
    },
  ],
})

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);
