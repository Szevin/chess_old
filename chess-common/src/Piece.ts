/* eslint-disable class-methods-use-this */
/* eslint-disable no-prototype-builtins */
import * as uuid from 'uuid'
import { Board } from './Board'
import Position, { Annotation, Direction } from './Position'

const PieceCodeTypes = {
  p: '',
  P: '',
  r: '',
  R: '',
  n: '',
  N: '',
  b: '',
  B: '',
  q: '',
  Q: '',
  k: '',
  K: '',
}
const pieceTypes = {
  pawn: '',
  rook: '',
  knight: '',
  bishop: '',
  queen: '',
  king: '',
}
const colorTypes = {
  white: '',
  black: '',
}
const pieceUnicodes = {
  '♙': '',
  '♖': '',
  '♘': '',
  '♗': '',
  '♕': '',
  '♔': '',
  '♟': '',
  '♜': '',
  '♞': '',
  '♝': '',
  '♛': '',
  '♚': '',
}

export type PieceCodeType = keyof typeof PieceCodeTypes
export type PieceType = keyof typeof pieceTypes
export type ColorType = keyof typeof colorTypes
export type PieceUnicode = keyof typeof pieceUnicodes

export interface PieceMoves {
  empty: Annotation[];
  captures: Annotation[];
  valid: Annotation[];
  castle: Annotation[];
}

export interface IPiece {
  name: PieceType;
  color: ColorType;
  position: Annotation;
}

export class Piece {
  id: string

  name: PieceType

  renderName: PieceType

  position: Annotation

  color: ColorType

  canTakeOwn = false

  isBlockable = true

  range: {
    move: number;
    capture: number;
  }

  hasMoved = false

  unicode: PieceUnicode

  takeable = true

  hidden = false

  disabled = false

  moves = {
    empty: [] as Annotation[],
    captures: [] as Annotation[],
    valid: [] as Annotation[],
    castle: [] as Annotation[],
  } as PieceMoves

  directions: {
    move: Direction[][];
    capture: Direction[][];
  }

  parsePiece = (piece: PieceCodeType): { name: PieceType; color: ColorType } => {
    switch (piece) {
      case 'p':
        return { name: 'pawn', color: 'black' }
      case 'P':
        return { name: 'pawn', color: 'white' }
      case 'r':
        return { name: 'rook', color: 'black' }
      case 'R':
        return { name: 'rook', color: 'white' }
      case 'n':
        return { name: 'knight', color: 'black' }
      case 'N':
        return { name: 'knight', color: 'white' }
      case 'b':
        return { name: 'bishop', color: 'black' }
      case 'B':
        return { name: 'bishop', color: 'white' }
      case 'q':
        return { name: 'queen', color: 'black' }
      case 'Q':
        return { name: 'queen', color: 'white' }
      case 'k':
        return { name: 'king', color: 'black' }
      case 'K':
        return { name: 'king', color: 'white' }
      default:
        throw Error('Invalid piece')
    }
  }

  encodePiece = (): PieceCodeType => {
    switch (this.name) {
      case 'pawn':
        return this.color === 'black' ? 'p' : 'P'
      case 'rook':
        return this.color === 'black' ? 'r' : 'R'
      case 'knight':
        return this.color === 'black' ? 'n' : 'N'
      case 'bishop':
        return this.color === 'black' ? 'b' : 'B'
      case 'queen':
        return this.color === 'black' ? 'q' : 'Q'
      case 'king':
        return this.color === 'black' ? 'k' : 'K'
      default:
        throw Error('Invalid piece')
    }
  }

  constructor(piece: PieceCodeType, position: Annotation) {
    const { name, color } = this.parsePiece(piece)
    if (!pieceTypes.hasOwnProperty(name) || !colorTypes.hasOwnProperty(color)) throw new Error(`Invalid piece: ${piece}`)
    if (!new Position(position).isValid()) throw new Error(`Invalid piece position: ${position}`)

    this.id = uuid.v4()
    this.name = name
    this.color = color
    this.renderName = name
    this.position = position
    this.directions = this.setDirections(name, color)
    this.range = this.setRange(name)
    this.unicode = this.setUnicode(name, color)
  }

  private setDirections = (name: PieceType, color: ColorType): {
    move: Direction[][];
    capture: Direction[][];
  } => {
    let directions: Direction[][] = []
    switch (name) {
      case 'pawn':
        return color === 'white'
          ? { move: [['up']], capture: [['up', 'left'], ['up', 'right']] }
          : { move: [['down']], capture: [['down', 'left'], ['down', 'right']] }
      case 'rook':
        directions = [['up'], ['right'], ['down'], ['left']]
        return { move: directions, capture: directions }
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
        ]
        return { move: directions, capture: directions }
      case 'bishop':
        directions = [
          ['up', 'left'],
          ['up', 'right'],
          ['right', 'down'],
          ['down', 'left'],
        ]
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
        ]
      // eslint-disable-next-line no-fallthrough
      default:
        return { move: directions, capture: directions }
    }
  }

  private setRange = (name: PieceType) => {
    switch (name) {
      case 'rook':
      case 'bishop':
      case 'queen':
        return {
          move: 8,
          capture: 8,
        }
      case 'pawn':
        return {
          move: 2,
          capture: 1,
        }
      case 'knight':
      case 'king':
      default:
        return {
          move: 1,
          capture: 1,
        }
    }
  }

  private setUnicode = (name: PieceType, color: ColorType): PieceUnicode => {
    switch (name) {
      case 'rook':
        return color === 'white' ? '♖' : '♜'
      case 'knight':
        return color === 'white' ? '♘' : '♞'
      case 'bishop':
        return color === 'white' ? '♗' : '♝'
      case 'queen':
        return color === 'white' ? '♕' : '♛'
      case 'king':
        return color === 'white' ? '♔' : '♚'
      case 'pawn':
      default:
        return color === 'white' ? '♙' : '♟'
    }
  }

  moveTo = (to: Annotation, board: Board): void => {
    this.position = to
    this.hasMoved = true

    if (this.name === 'pawn') {
      this.range.move = 1

      // Promotion
      if ((this.color === 'white' && this.position[1] === '8') || (this.color === 'black' && this.position[1] === '1')) {
        this.name = 'queen'
        this.directions = this.setDirections(this.name, this.color)
        this.range = this.setRange(this.name)
        this.unicode = this.setUnicode(this.name, this.color)
      }

      // En passant
      const enPassantPosition = new Position(to).addDirection(this.color === 'white' ? 'down' : 'up')
      const lastMove = board.moves[board.moves.length - 1]
      if (lastMove && board.getPiece(enPassantPosition.annotation)?.name === 'pawn' && lastMove.to === enPassantPosition.annotation) {
        board.removePiece(enPassantPosition.annotation)
      }
    }

    // Castling
    if (this.name === 'king' && this.moves.castle.includes(to)) {
      this.position = to
      const rookPos = ((to[0] === 'g' ? 'h' : 'a') + to[1]) as Annotation
      const rook = board.getPiece(rookPos)

      if (!rook) {
        throw Error('Rook not found')
      }
      const rookTo = ((to[0] === 'g' ? 'f' : 'd') + to[1]) as Annotation
      rook.moveTo(rookTo, board)
    }
  }
}

export default Piece
