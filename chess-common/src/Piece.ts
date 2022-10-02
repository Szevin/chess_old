import { Annotation, Direction } from './Position'

export type PieceTypes = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn'
export type ColorTypes = 'white' | 'black'
export type PieceUnicodes = '♖' | '♘' | '♗' | '♕' | '♔' | '♙' | '♜' | '♞' | '♝' | '♛' | '♚' | '♟' | null

class Piece {
  name: PieceTypes

  position: Annotation

  color: ColorTypes

  canTakeOwn: boolean

  isBlockable: boolean

  range: number

  unicode: PieceUnicodes

  moves: Annotation[]

  captures: Annotation[]

  directions: {
    move: Direction[][];
    capture: Direction[][];
  };

  constructor(name: PieceTypes, color: ColorTypes, position: Annotation) {
    this.name = name;
    this.color = color;
    this.position = position;
    this.moves = [];
    this.captures = [];
    this.directions = getPieceDirections(name, color);
    this.unicode = getPieceUnicode(name, color);
    this.range = getPieceRange(name);
    this.isBlockable = true;
    this.canTakeOwn = false;
  }
}

const getPieceDirections = (name: PieceTypes, color: ColorTypes): {
  move: Direction[][];
  capture: Direction[][];
} => {
  let directions: Direction[][] = []
	switch (name) {
		case 'pawn':
			return color === 'white'
				? { move: [['up'], ['up', 'up']], capture: [['up', 'left'], ['up', 'right']] }
				: { move: [['down'], ['down', 'down']], capture: [['down', 'left'], ['down', 'right']] };
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

const getPieceRange = (name: PieceTypes): number => {
	switch (name) {
		case 'rook':
		case 'bishop':
		case 'queen':
			return 8;
		case 'knight':
		case 'king':
		case 'pawn':
		default:
			return 1;
	}
};

const getPieceUnicode = (name: PieceTypes, color: ColorTypes): PieceUnicodes => {
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


export default Piece
