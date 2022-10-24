import { IUser } from 'chess-common';
import mongoose, { Schema } from 'mongoose';

const ChessStatsSchema = new mongoose.Schema({
  elo: {
    type: Number,
    required: true,
    default: 1000,
  },
  wins: {
    type: Number,
    required: true,
    default: 0,
  },
  losses: {
    type: Number,
    required: true,
    default: 0,
  },
  draws: {
    type: Number,
    required: true,
    default: 0,
  },
  streak: {
    type: Number,
    required: true,
    default: 0,
  },
})

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  stats: {
    normal: {
      type: ChessStatsSchema,
      required: true,
      default: {
        elo: 1000,
        wins: 0,
        losses: 0,
        draws: 0,
        streak: 0,
      },
    },
    adaptive: {
      type: ChessStatsSchema,
      required: true,
      default: {
        elo: 1000,
        wins: 0,
        losses: 0,
        draws: 0,
        streak: 0,
      },
    },
    custom: {
      type: ChessStatsSchema,
      required: true,
      default: {
        elo: 1000,
        wins: 0,
        losses: 0,
        draws: 0,
        streak: 0,
      },
    },
  },
  games: [
    {type: Schema.Types.ObjectId, ref: 'Board'}
  ],
}, { id: false })

export const UserModel = mongoose.model<IUser>('User', UserSchema);
