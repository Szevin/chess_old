import Position, { Annotation, Direction } from './Position'
import Piece, { PieceTypes, ColorTypes, PieceUnicodes, PieceMoves } from './Piece'
import { Move } from './Move'
import * as uuid from 'uuid'

export class Board {
	id: string
	name: string
	players: string[]
	spectators: string[]
	moves: Move[]
	pieces: Piece[]
	isCheck: boolean
	isCheckmate: boolean
	isStalemate: boolean
	currentPlayer: ColorTypes

  constructor(id: string, startingPlayer: ColorTypes = 'white', simulated: boolean = false) {
    this.id = id
    this.name = 'test'
    this.players = []
    this.spectators = []
    this.moves = []
    this.pieces = [
      new Piece('rook', 'white', 'a1'),
      new Piece('knight', 'white', 'b1'),
      new Piece('bishop', 'white', 'c1'),
      new Piece('queen', 'white', 'd1'),
      new Piece('king', 'white', 'e1'),
      new Piece('bishop', 'white', 'f1'),
      new Piece('knight', 'white', 'g1'),
      new Piece('rook', 'white', 'h1'),
      new Piece('pawn', 'white', 'a2'),
      new Piece('pawn', 'white', 'b2'),
      new Piece('pawn', 'white', 'c2'),
      new Piece('pawn', 'white', 'd2'),
      new Piece('pawn', 'white', 'e2'),
      new Piece('pawn', 'white', 'f2'),
      new Piece('pawn', 'white', 'g2'),
      new Piece('pawn', 'white', 'h2'),
      new Piece('rook', 'black', 'a8'),
      new Piece('knight', 'black', 'b8'),
      new Piece('bishop', 'black', 'c8'),
      new Piece('queen', 'black', 'd8'),
      new Piece('king', 'black', 'e8'),
      new Piece('bishop', 'black', 'f8'),
      new Piece('knight', 'black', 'g8'),
      new Piece('rook', 'black', 'h8'),
      new Piece('pawn', 'black', 'a7'),
      new Piece('pawn', 'black', 'b7'),
      new Piece('pawn', 'black', 'c7'),
      new Piece('pawn', 'black', 'd7'),
      new Piece('pawn', 'black', 'e7'),
      new Piece('pawn', 'black', 'f7'),
      new Piece('pawn', 'black', 'g7'),
      new Piece('pawn', 'black', 'h7'),
    ]
    this.isCheck = false
    this.isCheckmate = false
    this.isStalemate = false
    this.currentPlayer = startingPlayer

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

    piece.position = move.to
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
      let boardCopy = new Board("-1", this.currentPlayer, true)
      boardCopy.pieces = this.pieces.map((piece) => new Piece(piece.name, piece.color, piece.position))

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
