import { Board } from './Board'

export interface IUser {
  _id: string,
  name: string,
  email: string,
  password: string,
  avatar: string,
  elo: number,
  wins: number,
  losses: number,
  draws: number,
  streak: number,
  games: Board[],
  lastLogin: Date,
}
