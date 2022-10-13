/* eslint-disable no-prototype-builtins */
import * as uuid from 'uuid'
import { Board } from './Board'
import Position, { Annotation, Direction } from './Position'

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

  position: Annotation

  color: ColorType

  canTakeOwn = false

  isBlockable = true

  range: number

  hasMoved = false

  unicode: PieceUnicode

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

  constructor(name: PieceType, color: ColorType, position: Annotation) {
    if (!pieceTypes.hasOwnProperty(name)) throw new Error(`Invalid piece name: ${name}`)
    if (!colorTypes.hasOwnProperty(color)) throw new Error(`Invalid piece color: ${color}`)
    if (!new Position(position).isValid()) throw new Error(`Invalid piece position: ${position}`)

    this.id = uuid.v4()
    this.name = name
    this.color = color
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
      default:
        return { move: directions, capture: directions }
    }
  }

  private setRange = (name: PieceType): number => {
    switch (name) {
      case 'rook':
      case 'bishop':
      case 'queen':
        return 8
      case 'pawn':
        return 2
      case 'knight':
      case 'king':
      default:
        return 1
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
      this.range = 1

      if ((this.color === 'white' && this.position[1] === '8') || (this.color === 'black' && this.position[1] === '1')) {
        this.name = 'queen'
        this.directions = this.setDirections(this.name, this.color)
        this.range = this.setRange(this.name)
        this.unicode = this.setUnicode(this.name, this.color)
      }
    }

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
