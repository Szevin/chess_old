import mongoose from 'mongoose'
import { IUser } from './User'

export interface Message {
  id: string
  boardId: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId | IUser
  content: string
  timestamp: number
}
