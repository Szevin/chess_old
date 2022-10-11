import { Annotation } from './Position'

export interface Move {
  boardId: string;
  from: Annotation;
  to: Annotation;
  piece: string;
  player: string;
}
