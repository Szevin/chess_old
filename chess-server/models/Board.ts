import { Board } from 'chess-common';
import mongoose, { Schema } from 'mongoose';

const BoardSchema = new mongoose.Schema({
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
      type: String,
      required: true,
    },
  ],
  messages: [
    {
      type: String,
      required: true,
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
})

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);
