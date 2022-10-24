/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
import mongoose from 'mongoose'
import Position, { Annotation, COLS, Direction } from './Position'
import Piece, { ColorType, PieceCodeType, PieceMoves } from './Piece'
import { Move } from './Move'
import { Message } from './Message'
import { IUser } from './User'

export const defaultPieceSetup = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

export type GameType = 'normal' | 'adaptive' | 'custom'

export class Board {
  _id: string

  type: GameType = 'normal'

  createDate: Date = new Date()

  white: mongoose.Types.ObjectId | IUser

  black: mongoose.Types.ObjectId | IUser

  spectators: string[] = []

  messages: Message[] = []

  moves: Move[] = []

  pieces: Map<Annotation, Piece> = new Map()

  isCheck: boolean = false

  isCheckmate: boolean = false

  isStalemate: boolean = false

  winner: mongoose.Types.ObjectId | IUser | null = null

  loser: mongoose.Types.ObjectId | IUser | null = null

  currentPlayer: ColorType = 'white'

  status: 'waiting' | 'playing' | 'finished' = 'waiting'

  constructor(id: string, FEN: string = defaultPieceSetup, type: GameType = 'normal', simulated: boolean = false) {
    this._id = id
    this.type = type
    this.pieces = Board.FENtoMap(FEN)

    if (!simulated) {
      [...this.pieces.values()].forEach((piece) => {
        this.calcPieceValidMoves(piece)
      })
    }
  }

  getEnemyColor() {
    return this.currentPlayer === 'white' ? 'black' : 'white'
  }

  handleMove = (move: Move) => {
    this.removePiece(move.to)
    const piece = this.getPiece(move.from)
    if (!piece) throw Error(`Piece not found at ${move.from}!`)

    piece.moveTo(move.to, this)

    this.moves.push(move)
    this.currentPlayer = this.getEnemyColor();
    [...this.pieces.values()].forEach((piece) => {
      this.calcPieceValidMoves(piece)
    })

    this.isCheck = this.getEnemyPieces().map((piece) => piece.moves.captures).some((moves) => moves.includes(this.getKing(this.currentPlayer).position))
    this.isCheckmate = this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
    this.isStalemate = !this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
  }

  simulateMove = (move: Move) => {
    this.removePiece(move.to)
    const piece = this.getPiece(move.from)
    if (!piece) {
      console.log(move)
      throw Error(`Piece not found at ${move.from}!`)
    }

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

  getEnemyPieces = () => [...this.pieces.values()].filter((piece) => piece.color === this.getEnemyColor())

  getOwnPieces = () => [...this.pieces.values()].filter((piece) => piece.color === this.currentPlayer)

  getKing = (color: ColorType) => [...this.pieces.values()].find((piece) => piece.name === 'king' && piece.color === color)

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
      const boardCopy = new Board('-1', Board.MaptoFEN(this.pieces), this.type, true)
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

  getPiece = (at: Annotation) => this.pieces.get(at)

  removePiece = (at: Annotation) => this.pieces.delete(at)

  static MaptoFEN = (pieces: Map<Annotation, Piece>) => {
    const fen = new Array(8).fill([]).map(() => new Array(8).fill('1'));
    [...pieces.values()].forEach((piece) => {
      const position = new Position(piece.position)
      fen[8 - position.y][position.x - 1] = piece.encodePiece()
    })

    return fen.map((row) => row.join('')).join('/')
  }

  static FENtoMap = (FEN: string) => {
    const pieces = new Map<Annotation, Piece>()
    const rows = FEN.split('/')
    rows.forEach((row, rowIndex) => {
      let column = 0
      row.split('').forEach((piece) => {
        if (!Number.isInteger(Number(piece))) {
          pieces.set((`${COLS[column]}${8 - rowIndex}`) as Annotation, new Piece(piece as PieceCodeType, (`${COLS[column]}${8 - rowIndex}`) as Annotation))
          column += 1
        } else {
          column += parseInt(piece, 10)
        }
      })
    })

    return pieces
  }
}
