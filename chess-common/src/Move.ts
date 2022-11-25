import { Piece } from './Piece'
import { Annotation } from './Position'

export interface Move {
  boardId: string;
  from: Annotation;
  to: Annotation;
  piece: Piece;
  player: string;
  time: Date;
  delta: number;
}
