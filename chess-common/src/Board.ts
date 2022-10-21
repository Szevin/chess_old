/* eslint-disable import/no-named-as-default */
import Position, { Annotation, Direction } from './Position'
import Piece, { ColorType, PieceMoves, IPiece } from './Piece'
import { Move } from './Move'
import { Message } from './Message'
import mongoose from 'mongoose';
import { IUser } from './User';

export const defaultPieceSetup = [
  { name: 'rook', color: 'white', position: 'a1' },
  { name: 'knight', color: 'white', position: 'b1' },
  { name: 'bishop', color: 'white', position: 'c1' },
  { name: 'queen', color: 'white', position: 'd1' },
  { name: 'king', color: 'white', position: 'e1' },
  { name: 'bishop', color: 'white', position: 'f1' },
  { name: 'knight', color: 'white', position: 'g1' },
  { name: 'rook', color: 'white', position: 'h1' },
  { name: 'rook', color: 'black', position: 'a8' },
  { name: 'knight', color: 'black', position: 'b8' },
  { name: 'bishop', color: 'black', position: 'c8' },
  { name: 'queen', color: 'black', position: 'd8' },
  { name: 'king', color: 'black', position: 'e8' },
  { name: 'bishop', color: 'black', position: 'f8' },
  { name: 'knight', color: 'black', position: 'g8' },
  { name: 'rook', color: 'black', position: 'h8' },
  ...Array.from({ length: 8 }, (_, i) => ({ name: 'pawn', color: 'white', position: `${String.fromCharCode(97 + i)}2` })),
  ...Array.from({ length: 8 }, (_, i) => ({ name: 'pawn', color: 'black', position: `${String.fromCharCode(97 + i)}7` })),
] as IPiece[]

export class Board {
  _id: string

  createDate: Date = new Date()

  white: mongoose.Types.ObjectId | IUser

  black: mongoose.Types.ObjectId | IUser

  spectators: string[] = []

  messages: Message[] = []

  moves: Move[] = []

  pieces: Piece[]

  isCheck: boolean = false

  isCheckmate: boolean = false

  isStalemate: boolean = false

  winner: mongoose.Types.ObjectId | IUser | null = null
  loser: mongoose.Types.ObjectId | IUser | null = null

  currentPlayer: ColorType = 'white'

  status: 'waiting' | 'playing' | 'finished' = 'waiting'

  constructor(id: string, pieces: IPiece[] = defaultPieceSetup, simulated: boolean = false) {
    if (pieces.some((p, i) => pieces.findIndex((p2) => p2.position === p.position) !== i)) {
      throw new Error('Two pieces with same position')
    }

    this._id = id
    this.pieces = pieces.map((piece) => new Piece(piece.name, piece.color, piece.position))

    if (!simulated) {
      this.pieces.forEach((piece) => {
        this.calcPieceValidMoves(piece)
      })
    }
  }

  getEnemyColor() {
    return this.currentPlayer === 'white' ? 'black' : 'white'
  }

  handleMove = (move: Move) => {
    this.removePiece(move.to)
    const piece = this.pieces.find((piece) => piece.position === move.from)
    if (!piece) throw Error('Piece not found!')

    piece.moveTo(move.to, this)

    this.moves.push(move)
    this.currentPlayer = this.getEnemyColor()
    this.pieces.forEach((piece) => {
      this.calcPieceValidMoves(piece)
    })

    this.isCheck = this.getEnemyPieces().map((piece) => piece.moves.captures).some((moves) => moves.includes(this.getKing(this.currentPlayer).position))
    this.isCheckmate = this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
    this.isStalemate = !this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
  }

  simulateMove = (move: Move) => {
    this.removePiece(move.to)
    const piece = this.getPiece(move.from)
    if (!piece) throw Error('Piece not found!')

    piece.position = move.to
    const attacks: Annotation[] = []
    this.getEnemyPieces().forEach((piece) => {
      attacks.push(...this.getCaptureMoves(piece))
    })

    this.isCheck = this.getKing(this.currentPlayer) && attacks.includes(this.getKing(this.currentPlayer).position)
  }

  calcPieceValidMoves = (piece: Piece) => {
    piece.moves = this.getMoves(piece)
  }

  getEnemyPieces = () => this.pieces.filter((piece) => piece.color === this.getEnemyColor())

  getOwnPieces = () => this.pieces.filter((piece) => piece.color === this.currentPlayer)

  getPiece = (at: Annotation): Piece | undefined => this.pieces.find((piece) => piece.position === at)

  getKing = (color: ColorType) => this.pieces.find((piece) => piece.name === 'king' && piece.color === color)

  getMoves = (piece: Piece): PieceMoves => {
    const moves = {
      empty: [],
      captures: [],
      castle: [],
      valid: [],
    } as PieceMoves

    moves.empty = this.filterPinnedMoves(piece, this.getEmptyMoves(piece))
    moves.captures = this.filterPinnedMoves(piece, this.getCaptureMoves(piece))
    moves.castle = this.getCastleMoves(piece)

    moves.valid = [...moves.empty, ...moves.captures, ...moves.castle]

    return moves
  }

  getEmptyMoves = (piece: Piece): Annotation[] => {
    const moves: Position[] = []
    piece.directions.move.forEach((direction) => {
      const position = new Position(piece.position)
      position.addDirections(direction)
      let directionRange = 0
      while (
        (!piece.isBlockable || (piece.isBlockable && this.getPiece(position.annotation)?.color !== piece.color))
        && position.isValid()
        && directionRange < piece.range.move
      ) {
        if (this.getPiece(position.annotation) && this.getPiece(position.annotation)?.color !== piece.color) {
          break
        }
        moves.push(new Position(position.annotation))
        position.addDirections(direction)
        directionRange += 1
      }
    })

    return moves.map((move) => move.annotation)
  }

  getCaptureMoves = (piece: Piece): Annotation[] => {
    const captures: Position[] = []

    piece.directions.capture.forEach((direction) => {
      const position = new Position(piece.position)
      position.addDirections(direction)
      let directionRange = 0
      while (
        (!piece.isBlockable || (piece.isBlockable && this.getPiece(position.annotation)?.color !== piece.color))
        && position.isValid()
        && directionRange < piece.range.capture
      ) {
        if (this.getPiece(position.annotation) && (this.getPiece(position.annotation)?.color !== piece.color || piece.canTakeOwn)) {
          captures.push(new Position(position.annotation))
          break
        }

        // En passant
        if (piece.name === 'pawn') {
          const enPassantPosition = new Position(position.annotation).addDirection(piece.color === 'white' ? 'down' : 'up')
          const lastMove = this.moves[this.moves.length - 1]
          if (lastMove && this.getPiece(enPassantPosition.annotation)?.name === 'pawn' && lastMove.to === enPassantPosition.annotation) {
            captures.push(new Position(position.annotation))
            break
          }
        }

        position.addDirections(direction)
        directionRange += 1
      }
    })

    return captures.map((move) => move.annotation)
  }

  filterPinnedMoves = (piece: Piece, moves: Annotation[]): Annotation[] => {
    const filteredMoves: Annotation[] = []
    if (!moves) return filteredMoves

    moves.forEach((move) => {
      const boardCopy = new Board('-1', this.pieces, true)
      boardCopy.currentPlayer = this.currentPlayer

      boardCopy.simulateMove({
        from: piece.position,
        to: move,
        piece: piece.name,
        player: piece.color,
        boardId: this._id,
      })

      if (!boardCopy.isCheck) {
        filteredMoves.push(move)
      }
    })

    return filteredMoves
  }

  getCastleMoves = (piece: Piece): Annotation[] => {
    const moves: Annotation[] = []
    if (piece.hasMoved || piece.name !== 'king') return moves

    const directions = ['left', 'right'] as Direction[]

    directions.forEach((direction) => {
      const position = new Position(piece.position)
      while (position.isValid() && !this.getEnemyPieces().map((piece) => piece.moves.valid).some((moves) => moves.includes(position.annotation))) {
        position.addDirection(direction)
        const piece = this.getPiece(position.annotation)
        if (piece) {
          if (piece.name === 'rook' && !piece.hasMoved) {
            moves.push(position.addDirections(direction === 'left' ? ['right', 'right'] : ['left']).annotation)
          }
          break
        }
      }
    })

    return moves
  }

  removePiece = (at: Annotation) => {
    this.pieces = this.pieces.filter((piece) => piece.position !== at)
  }
}
