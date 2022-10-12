import { Board } from 'chess-common';
import mongoose, { Schema } from 'mongoose';
import { v1 } from 'uuid';

const BoardSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.String,
    required: true,
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
      type: String,
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
