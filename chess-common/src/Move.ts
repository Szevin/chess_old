import { Piece } from './Piece'
import { Annotation } from './Position'

export interface Move {
  id: number;
  boardId: string;
  from: Annotation;
  to: Annotation;
  piece: Piece;
  player: string;
  time: Date;
}
