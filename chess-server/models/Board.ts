import Position, { Direction } from './Position';

export type Annotation =
	| 'a1'
	| 'a2'
	| 'a3'
	| 'a4'
	| 'a5'
	| 'a6'
	| 'a7'
	| 'a8'
	| 'b1'
	| 'b2'
	| 'b3'
	| 'b4'
	| 'b5'
	| 'b6'
	| 'b7'
	| 'b8'
	| 'c1'
	| 'c2'
	| 'c3'
	| 'c4'
	| 'c5'
	| 'c6'
	| 'c7'
	| 'c8'
	| 'd1'
	| 'd2'
	| 'd3'
	| 'd4'
	| 'd5'
	| 'd6'
	| 'd7'
	| 'd8'
	| 'e1'
	| 'e2'
	| 'e3'
	| 'e4'
	| 'e5'
	| 'e6'
	| 'e7'
	| 'e8'
	| 'f1'
	| 'f2'
	| 'f3'
	| 'f4'
	| 'f5'
	| 'f6'
	| 'f7'
	| 'f8'
	| 'g1'
	| 'g2'
	| 'g3'
	| 'g4'
	| 'g5'
	| 'g6'
	| 'g7'
	| 'g8'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'h7'
	| 'h8';

export type ColorTypes = 'white' | 'black';
export type PieceTypes = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';
export type PieceUnicodes = '♖' | '♘' | '♗' | '♕' | '♔' | '♙' | '♜' | '♞' | '♝' | '♛' | '♚' | '♟' | null;

export class Board {
	id: string;
	name: string;
	players: string[];
	spectators: string[];
	moves: Move[];
	pieces: Piece[];
	isCheck: boolean;
	isCheckmate: boolean;
	isStalemate: boolean;
	currentPlayer: string;

	constructor(id: string) {
		this.id = id;
		this.name = 'test';
		this.players = [];
		this.spectators = [];
		this.moves = [];
		(this.pieces = [
			new Piece('pawn', 'white', 'a2'),
			new Piece('pawn', 'white', 'b2'),
			new Piece('pawn', 'white', 'c2'),
			new Piece('pawn', 'white', 'd2'),
			new Piece('pawn', 'white', 'e2'),
			new Piece('pawn', 'white', 'f2'),
			new Piece('pawn', 'white', 'g2'),
			new Piece('pawn', 'white', 'h2'),
			new Piece('pawn', 'black', 'a7'),
			new Piece('pawn', 'black', 'b7'),
			new Piece('pawn', 'black', 'c7'),
			new Piece('pawn', 'black', 'd7'),
			new Piece('pawn', 'black', 'e7'),
			new Piece('pawn', 'black', 'f7'),
			new Piece('pawn', 'black', 'g7'),
			new Piece('pawn', 'black', 'h7'),

			new Piece('rook', 'white', 'a1'),
			new Piece('rook', 'white', 'h1'),
			new Piece('rook', 'black', 'a8'),
			new Piece('rook', 'black', 'h8'),
			new Piece('knight', 'white', 'b1'),
			new Piece('knight', 'white', 'g1'),
			new Piece('knight', 'black', 'b8'),
			new Piece('knight', 'black', 'g8'),
			new Piece('bishop', 'white', 'c1'),
			new Piece('bishop', 'white', 'f1'),
			new Piece('bishop', 'black', 'c8'),
			new Piece('bishop', 'black', 'f8'),
			new Piece('queen', 'white', 'd1'),
			new Piece('queen', 'black', 'd8'),
			new Piece('king', 'white', 'e1'),
			new Piece('king', 'black', 'e8'),
		]),
			(this.isCheck = false);
		this.isCheckmate = false;
		this.isStalemate = false;
		this.currentPlayer = 'white';

		this.pieces.map((piece) => piece.calcValidMoves(this));
	}

	handleMove(move: Move) {
		this.pieces = this.pieces.filter((piece) => piece.position !== move.to);
		const piece = this.pieces.find((piece) => piece.position === move.from);
		if (!piece) throw Error('Piece not found!');

		piece.position = move.to;
		this.moves.push(move);
		this.pieces.forEach((piece) => {
			piece.calcValidMoves(this);
		});

		this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
	}
}

export interface Move {
	from: Annotation;
	to: Annotation;
	piece: string;
}

export class Piece {
	name: PieceTypes;

	position: Annotation;

	color: ColorTypes;

	canTakeOwn: boolean;

	isBlockable: boolean;

	range: number;

	unicode: PieceUnicodes;

	moves: Annotation[];

	captures: Annotation[];

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

	calcValidMoves(board: Board) {
		this.moves = getDirectionalMoves(board, this);
		this.captures = getCaptureMoves(board, this);
	}
}

export const getPiece = (board: Board, at: Annotation) => board.pieces.find((piece) => piece.position === at);

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

const getDirectionalMoves = (board: Board, piece: Piece): Annotation[] => {
	const moves: Position[] = [];
	piece.directions.move.forEach((direction) => {
		const position = new Position(piece.position);
		position.addDirections(direction);
		let directionRange = 0;
		while (
			(!piece.isBlockable || (piece.isBlockable && getPiece(board, position.annotation)?.color !== piece.color)) &&
			position.isValid() &&
			directionRange < piece.range
		) {
			if (getPiece(board, position.annotation) && getPiece(board, position.annotation)?.color !== piece.color) {
				break;
			}
			moves.push(new Position(position.annotation));
			position.addDirections(direction);
			directionRange += 1;
		}
	});
	return moves.map((move) => move.annotation);
};

const getCaptureMoves = (board: Board, piece: Piece): Annotation[] => {
	const captures: Position[] = [];
	piece.directions.capture.forEach((direction) => {
		const position = new Position(piece.position);
		position.addDirections(direction);
		let directionRange = 0;
		while (
			(!piece.isBlockable || (piece.isBlockable && getPiece(board, position.annotation)?.color !== piece.color)) &&
			position.isValid() &&
			directionRange < piece.range
		) {
			if (getPiece(board, position.annotation) && getPiece(board, position.annotation)?.color !== piece.color) {
        captures.push(new Position(position.annotation));
				break;
			}
			position.addDirections(direction);
			directionRange += 1;
		}
	});

	return captures.map((move) => move.annotation);
};
