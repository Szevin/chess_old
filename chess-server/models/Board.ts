import { Board } from 'chess-common';
import mongoose, { Schema } from 'mongoose';
import { v1 } from 'uuid';

const BoardSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: true,
  },
  createDate: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now,
  },
  white: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  black: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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
      required: false,
    },
  ],
  pieces: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'normal',
  },
  rules: [
    {
      type: String,
      required: true,
    },
  ],
  round: {
    type: Number,
    required: true,
    default: 0,
  },
  capturedPieces: {
    type: Array,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  whiteTime: {
    type: Number,
    required: true,
  },
  blackTime: {
    type: Number,
    required: true,
  },
  lastMoveDate: {
    type: Date,
    required: false,
  },
}, { id: false });

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);
