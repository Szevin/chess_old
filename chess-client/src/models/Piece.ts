import BishopSvg from '../assets/pieces/BishopSvg'
import KingSvg from '../assets/pieces/KingSvg'
import KnightSvg from '../assets/pieces/KnightSvg'
import PawnSvg from '../assets/pieces/PawnSvg'
import QueenSvg from '../assets/pieces/QueenSvg'
import RookSvg from '../assets/pieces/RookSvg'
import { Annotation, Direction } from './Position'

export type PieceTypes = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn'
export type ColorTypes = 'white' | 'black'
export type PieceUnicodes = '♖' | '♘' | '♗' | '♕' | '♔' | '♙' | '♜' | '♞' | '♝' | '♛' | '♚' | '♟' | null

interface Piece {
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
}

export const getRender = (name: PieceTypes, color: ColorTypes) => {
  switch (name) {
    case 'pawn':
      return PawnSvg({ color })
    case 'rook':
      return RookSvg({ color })
    case 'knight':
      return KnightSvg({ color })
    case 'bishop':
      return BishopSvg({ color })
    case 'queen':
      return QueenSvg({ color })
    case 'king':
      return KingSvg({ color })
    default:
      return PawnSvg({ color })
  }
}

export default Piece
