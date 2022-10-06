import { Annotation, Direction } from './Position'

export type PieceTypes = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn'
export type ColorTypes = 'white' | 'black'
export type PieceUnicodes = '♖' | '♘' | '♗' | '♕' | '♔' | '♙' | '♜' | '♞' | '♝' | '♛' | '♚' | '♟' | null

export interface PieceMoves {
  empty: Annotation[];
  captures: Annotation[];
  valid: Annotation[];
}

export interface IPiece {
  name: PieceTypes;
  color: ColorTypes;
  position: Annotation;
}

class Piece {
  name: PieceTypes
  position: Annotation
  color: ColorTypes
  canTakeOwn = false;
  isBlockable = true
  range: number
  hasMoved = false
  unicode: PieceUnicodes
  moves = {
    empty: [] as Annotation[],
    captures: [] as Annotation[],
    valid: [] as Annotation[],
  } as PieceMoves
  directions: {
    move: Direction[][];
    capture: Direction[][];
  };

  constructor(name: PieceTypes, color: ColorTypes, position: Annotation) {
    this.name = name;
    this.color = color;
    this.position = position;
    this.directions = this.setDirections(name, color);
    this.range = this.setRange(name);
    this.unicode = this.setUnicode(name, color);
  }

  setDirections = (name: PieceTypes, color: ColorTypes): {
    move: Direction[][];
    capture: Direction[][];
  } => {
    let directions: Direction[][] = []
    switch (name) {
      case 'pawn':
        return color === 'white'
          ? { move: [['up']], capture: [['up', 'left'], ['up', 'right']] }
          : { move: [['down']], capture: [['down', 'left'], ['down', 'right']] };
      case 'rook':
        directions = [['up'], ['right'], ['down'], ['left']]
        return { move: directions, capture: directions };
      case 'knight':
        directions = [
          ['up', 'up', 'left'],
          ['up', 'up', 'right'],
          ['down', 'down', 'left'],
          ['down', 'down', 'right'],
          ['left', 'left', 'up'],
          ['left', 'left', 'down'],
          ['right', 'right', 'up'],
          ['right', 'right', 'down'],
        ];
        return { move: directions, capture: directions }
      case 'bishop':
        directions = [
          ['up', 'left'],
          ['up', 'right'],
          ['right', 'down'],
          ['down', 'left'],
        ];
        return { move: directions, capture: directions }
      case 'queen':
      case 'king':
        directions = [
          ['up', 'left'],
          ['up'],
          ['up', 'right'],
          ['right'],
          ['right', 'down'],
          ['down'],
          ['down', 'left'],
          ['left'],
        ];
      default:
        return { move: directions, capture: directions }
    }
  };

  setRange = (name: PieceTypes): number => {
    switch (name) {
      case 'rook':
      case 'bishop':
      case 'queen':
        return 8;
      case 'pawn':
        return 2;
      case 'knight':
      case 'king':
      default:
        return 1;
    }
  };

  setUnicode = (name: PieceTypes, color: ColorTypes): PieceUnicodes => {
    switch (name) {
      case 'rook':
        return color === 'white' ? '♜' : '♖';
      case 'knight':
        return color === 'white' ? '♞' : '♘';
      case 'bishop':
        return color === 'white' ? '♝' : '♗';
      case 'queen':
        return color === 'white' ? '♛' : '♕';
      case 'king':
        return color === 'white' ? '♚' : '♔';
      case 'pawn':
      default:
        return color === 'white' ? '♟' : '♙';
    }

  };

  moveTo = (to: Annotation): void => {
    this.position = to;
    this.hasMoved = true;

    if(this.name === 'pawn') {
      this.range = 1;

      if((this.color === 'white' && this.position[1] === '8') || (this.color === 'black' && this.position[1] === '1')) {
        this.name = 'queen';
        this.directions = this.setDirections(this.name, this.color);
        this.range = this.setRange(this.name);
        this.unicode = this.setUnicode(this.name, this.color);
      }
    }
  }

}

export default Piece
