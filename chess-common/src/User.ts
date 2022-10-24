import { Board } from './Board'

export interface ChessStats {
  elo: number,
  wins: number,
  losses: number,
  draws: number,
  streak: number,
}

export interface IUser {
  _id: string,
  name: string,
  email: string,
  password: string,
  avatar: string,
  games: Board[],
  lastLogin: Date,
  stats: {
    normal: ChessStats,
    adaptive: ChessStats,
    custom: ChessStats,
  }
}
