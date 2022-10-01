import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  player1_id: {
    type: Number,
    required: true,
  },
  player2_id: {
    type: Number,
    required: true,
  },
})

export const Board = mongoose.model('Board', BoardSchema);
