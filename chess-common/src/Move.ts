import { Annotation } from './Position';


export interface Move {
  from: Annotation;
  to: Annotation;
  piece: string;
  player: string;
}
