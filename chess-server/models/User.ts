import { IUser } from 'chess-common';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  matches: {
    type: Array,
    required: false,
  },
})

export const User = mongoose.model<IUser>('User', UserSchema);
