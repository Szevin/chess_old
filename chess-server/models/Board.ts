import { Board } from 'chess-common';
import mongoose, { Schema } from 'mongoose';
import { v1 } from 'uuid';

const BoardSchema = new mongoose.Schema(
  {
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
      required: true,
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
    default: 1,
  }
}, { id: false });

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);
