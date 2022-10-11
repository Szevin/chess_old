import { IUser } from 'chess-common';
import mongoose, { Schema } from 'mongoose';

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
  games: [
    {type: Schema.Types.ObjectId, ref: 'Board'}
  ],
}, { id: false })

export const UserModel = mongoose.model<IUser>('User', UserSchema);
