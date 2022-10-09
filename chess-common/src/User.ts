import { Board } from './Board'

export interface IUser {
  _id: string;
  name: string;
  password: string;
  lastLogin: Date;
  email: string;
  picture: string;
  matches: Board[];
}
