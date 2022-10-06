import Position, { Annotation, Direction } from './Position'
import Piece, { PieceTypes, ColorTypes, PieceUnicodes, PieceMoves, IPiece } from './Piece'
import { Move } from './Move'
import * as uuid from 'uuid'

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
	id: string
	players: string[] = []
	spectators: string[] = []
	moves: Move[] = []
	pieces: Piece[]
	isCheck: boolean = false
	isCheckmate: boolean = false
	isStalemate: boolean = false
	currentPlayer: ColorTypes = 'white'

  constructor(id: string, pieces: IPiece[] = defaultPieceSetup, simulated: boolean = false) {
    this.id = id
    this.pieces = pieces.map(piece => new Piece(piece.name, piece.color, piece.position))

    if (!simulated){
      this.pieces.forEach((piece) => {
        this.calcPieceValidMoves(piece)
      })
    }
  }

  getEnemyColor() {
    return this.currentPlayer === 'white' ? 'black' : 'white'
  }

  handleMove = (move: Move) => {
    this.pieces = this.pieces.filter((piece) => piece.position !== move.to)
    const piece = this.pieces.find((piece) => piece.position === move.from)
    if (!piece) throw Error('Piece not found!')

    piece.moveTo(move.to)

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
    this.pieces = this.pieces.filter((piece) => piece.position !== move.to)
    const piece = this.getPiece(move.from)
    if (!piece) throw Error('Piece not found!')

    piece.position = move.to
    let attacks: Annotation[] = []
    this.getEnemyPieces().forEach((piece) => {
      attacks.push(...this.getCaptureMoves(piece))
    })

    this.isCheck = this.getKing(this.currentPlayer) && attacks.includes(this.getKing(this.currentPlayer).position)
  }

  calcPieceValidMoves = (piece: Piece) => {
    piece.moves = this.getMoves(piece)
  }

  getEnemyPieces = () => {
    return this.pieces.filter((piece) => piece.color === this.getEnemyColor())
  }

  getOwnPieces = () => {
    return this.pieces.filter((piece) => piece.color === this.currentPlayer)
  }

  getPiece = (at: Annotation) => this.pieces.find((piece) => piece.position === at)

  getKing = (color: ColorTypes) => this.pieces.find((piece) => piece.name === 'king' && piece.color === color)

  getMoves = (piece: Piece): PieceMoves => {
    const moves = {
      empty: [],
      captures: [],
      valid: [],
    } as PieceMoves

    moves.empty = this.filterPinnedMoves(piece, this.getEmptyMoves(piece))
    moves.captures = this.filterPinnedMoves(piece, this.getCaptureMoves(piece))
    moves.valid = [...moves.empty, ...moves.captures]

    return moves
  }

  getEmptyMoves = (piece: Piece): Annotation[] => {
    const moves: Position[] = []
    piece.directions.move.forEach((direction) => {
      const position = new Position(piece.position)
      position.addDirections(direction)
      let directionRange = 0
      while (
        (!piece.isBlockable || (piece.isBlockable && this.getPiece(position.annotation)?.color !== piece.color)) &&
        position.isValid() &&
        directionRange < piece.range
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
        (!piece.isBlockable || (piece.isBlockable && this.getPiece(position.annotation)?.color !== piece.color)) &&
        position.isValid() &&
        directionRange < piece.range
      ) {
        if (this.getPiece(position.annotation) && this.getPiece(position.annotation)?.color !== piece.color) {
          captures.push(new Position(position.annotation))
          break
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
      let boardCopy = new Board("-1", this.pieces, true)
      boardCopy.currentPlayer = this.currentPlayer

      boardCopy.simulateMove({
        from: piece.position,
        to: move,
        piece: piece.name,
      })

      if (!boardCopy.isCheck) {
        filteredMoves.push(move)
      }
    })

    return filteredMoves
  }
}
