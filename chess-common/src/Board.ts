/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import Position, { Annotation, COLS, Direction } from './Position'
import Piece, { ColorType, PieceCodeType, PieceMoves } from './Piece'
import { Move } from './Move'
import { Message } from './Message'
import { IUser } from './User'

export const defaultPieceSetup = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

export type GameType = 'normal' | 'adaptive' | 'custom'

export enum Rule {
  NO_RETREAT = 'no-retreat',
  NO_CAPTURE = 'no-capture',
  RENDER_SWAP = 'render-swap',
  FOG_OF_WAR = 'fog-of-war',
  NO_PAWNS = 'no-pawns',
}

export class Board {
  _id: string

  name: string

  isPublic: boolean = true

  type: GameType = 'normal'

  createDate: Date = new Date()

  white: mongoose.Types.ObjectId | IUser

  black: mongoose.Types.ObjectId | IUser

  spectators: string[] = []

  messages: Message[] = []

  moves: Move[] = []

  pieces: Record<string, Piece> = {}

  isCheck: boolean = false

  isCheckmate: boolean = false

  isStalemate: boolean = false

  winner: mongoose.Types.ObjectId | IUser | null = null

  loser: mongoose.Types.ObjectId | IUser | null = null

  currentPlayer: ColorType = 'white'

  status: 'waiting' | 'playing' | 'finished' = 'waiting'

  rules: Rule[] = []

  round: number = 0

  rule_frequency = 6

  capturedPieces: Piece[] = []

  time: number = -1

  whiteTime = 0

  blackTime = 0

  constructor(id: string, name: string = '', isPublic: boolean = true, FEN: string = defaultPieceSetup, type: GameType = 'normal', simulated: boolean = false, time: number = -1, rules: Rule[] = []) {
    this._id = id
    this.name = name
    this.isPublic = isPublic
    this.type = type
    this.time = time
    this.pieces = Board.FENtoMap(FEN)
    this.rules = type !== 'normal' ? rules : []

    if (!simulated) {
      [...Object.values(this.pieces)].forEach((piece) => {
        this.calcPieceValidMoves(piece)
      })
      this.setRules()
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
    this.currentPlayer = this.getEnemyColor()
    Object.keys(this.pieces).forEach((key) => {
      if (this.pieces[key].position !== key) {
        const temp = Object.assign(new Piece('p', 'a1'), this.pieces[key])
        delete this.pieces[key]
        this.pieces[temp.position] = temp
      }
    });
    [...Object.values(this.pieces)].forEach((piece) => {
      this.calcPieceValidMoves(piece)
    })
    this.round += 1
    this.setRules()

    this.isCheck = this.getEnemyPieces().map((piece) => piece.moves.captures).some((moves) => moves.includes(this.getKing(this.currentPlayer).position))
    this.isCheckmate = this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
    this.isStalemate = !this.isCheck && this.getOwnPieces().every((piece) => piece.moves.valid.length === 0)
  }

  simulateMove = (move: Move) => {
    this.removePiece(move.to)
    const piece = this.getPiece(move.from)
    if (!piece) {
      throw Error(`Piece not found at ${move.from}!`)
    }

    piece.position = move.to
    Object.keys(this.pieces).forEach((key) => {
      if (this.pieces[key].position !== key) {
        const temp = Object.assign(new Piece('p', 'a1'), this.pieces[key])
        delete this.pieces[key]
        this.pieces[temp.position] = temp
      }
    })

    const attacks: Annotation[] = []
    this.getEnemyPieces().forEach((piece) => {
      attacks.push(...this.getCaptureMoves(piece))
    })
    this.setRules()

    this.isCheck = this.getKing(this.currentPlayer) && attacks.includes(this.getKing(this.currentPlayer).position)
    this.round += 1
  }

  calcPieceValidMoves = (piece: Piece) => {
    piece.moves = this.getMoves(piece)
  }

  getEnemyPieces = () => [...Object.values(this.pieces)].filter((piece) => piece.color === this.getEnemyColor())

  getOwnPieces = () => [...Object.values(this.pieces)].filter((piece) => piece.color === this.currentPlayer)

  getKing = (color: ColorType) => [...Object.values(this.pieces)].find((piece) => piece.name === 'king' && piece.color === color)

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
        if (this.getPiece(position.annotation)) {
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
      let position = new Position(piece.position)
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

        position.addDirections(direction)
        directionRange += 1
      }

      // En passant
      if (piece.name === 'pawn') {
        position = new Position(piece.position).addDirections(direction)
        const enPassantPosition = new Position(position.annotation).addDirection(piece.color === 'white' ? 'down' : 'up')
        const lastMove = this.moves[this.moves.length - 1]
        if (
          lastMove
          && this.getPiece(enPassantPosition.annotation)?.name === 'pawn'
          && lastMove.to === enPassantPosition.annotation
          && lastMove.from === new Position(position.annotation).addDirection(piece.color === 'white' ? 'up' : 'down').annotation
        ) {
          captures.push(new Position(position.annotation))
        }
      }
    })

    return captures.map((move) => move.annotation)
  }

  filterPinnedMoves = (piece: Piece, moves: Annotation[]): Annotation[] => {
    const filteredMoves: Annotation[] = []
    if (!moves) return filteredMoves

    moves.forEach((move) => {
      const boardCopy = new Board('-1', this.name, this.isPublic, Board.MaptoFEN(this.pieces), this.type, true, this.time, this.rules)
      boardCopy.round = this.round
      boardCopy.currentPlayer = this.currentPlayer

      boardCopy.simulateMove({
        from: piece.position,
        to: move,
        piece: Object.assign(new Piece('p', 'a1'), piece),
        player: piece.color,
        boardId: this._id,
        time: dayjs().toDate(),
        delta: this.moves.length > 0 ? dayjs().diff(dayjs(this.moves.at(-1)?.time)) : 0,
      })

      if (!boardCopy.isCheck) {
        filteredMoves.push(move)
      }
    })

    return filteredMoves
  }

  getCastleMoves = (piece: Piece): Annotation[] => {
    const moves: Annotation[] = []
    if (piece.hasMoved || piece.name !== 'king' || this.isCheck) return moves

    const directions = ['left', 'right'] as Direction[]

    const enemyValidMoves = this.getEnemyPieces().reduce((acc, enemyPiece) => {
      acc.push(...enemyPiece.moves.empty)
      return acc
    }, [] as Annotation[])

    directions.forEach((direction) => {
      const position = new Position(piece.position)
      while (position.isValid() && !enemyValidMoves.includes(position.annotation)) {
        position.addDirection(direction)
        const piece = this.getPiece(position.annotation)
        if (piece) {
          if (piece.name === 'rook' && !piece.hasMoved) {
            switch (piece.color) {
              case 'white':
                moves.push(new Position(position.annotation).addDirections(direction === 'left' ? ['right', 'right'] : ['left']).annotation)
                break
              case 'black':
                moves.push(new Position(position.annotation).addDirections(direction === 'left' ? ['right', 'right'] : ['left']).annotation)
                break
              default:
                break
            }
          }
          break
        }
      }
    })

    return moves
  }

  getPiece = (at: Annotation) => this.pieces[at]

  removePiece = (at: Annotation) => {
    if (!this.pieces[at]) return

    this.capturedPieces.push(Object.assign(new Piece('p', 'a1'), this.pieces[at]))
    delete this.pieces[at]
  }

  static MaptoFEN = (pieces: Record<string, Piece>) => {
    const fen = new Array(8).fill([]).map(() => new Array(8).fill('1'));
    [...Object.values(pieces)].forEach((piece) => {
      const position = new Position(piece.position)
      fen[8 - position.y][position.x - 1] = piece.encodePiece()
    })

    return fen.map((row) => row.join('')).join('/')
  }

  static FENtoMap = (FEN: string) => {
    const pieces: Record<string, Piece> = {}
    const rows = FEN.split('/')
    rows.forEach((row, rowIndex) => {
      let column = 0
      row.split('').forEach((piece) => {
        if (!Number.isInteger(Number(piece))) {
          pieces[(`${COLS[column]}${8 - rowIndex}`) as Annotation] = new Piece(piece as PieceCodeType, (`${COLS[column]}${8 - rowIndex}`) as Annotation)
          column += 1
        } else {
          column += parseInt(piece, 10)
        }
      })
    })

    return pieces
  }

  private setRules = () => {
    if (this.type === 'normal') return
    this.resetRules()

    let piecesArray = Object.values(this.pieces)

    // eslint-disable-next-line default-case
    switch (this.rules[Math.floor((this.round / this.rule_frequency) % this.rules.length)]) {
      case Rule.FOG_OF_WAR:
        piecesArray = piecesArray.map((piece) => {
          piece.hidden = true
          return piece
        })
        break
      case Rule.NO_CAPTURE:
        piecesArray = piecesArray.map((piece) => {
          piece.moves.captures = []
          return piece
        })
        break
      case Rule.NO_PAWNS:
        piecesArray = piecesArray.map((piece) => {
          if (piece.name !== 'pawn') return piece
          piece.moves.valid = []
          piece.moves.captures = []
          piece.moves.empty = []
          piece.takeable = false
          piece.disabled = true
          return piece
        })
        break
      case Rule.NO_RETREAT:
        piecesArray = piecesArray.map((piece) => {
          piece.moves.empty = piece.moves.empty.filter((move) => {
            const p = new Position(move)
            return piece.color === 'white' ? p.y >= new Position(piece.position).y : p.y <= new Position(piece.position).y
          })
          piece.moves.valid = [...piece.moves.captures, ...piece.moves.empty, ...piece.moves.captures]

          return piece
        })
        break
      case Rule.RENDER_SWAP:
        piecesArray = piecesArray.map((piece) => {
          switch (piece.name) {
            case 'knight':
              piece.renderName = 'bishop'
              return piece
            case 'bishop':
              piece.renderName = 'knight'
              return piece
            default:
              return piece
          }
        })
    }

    this.pieces = piecesArray.reduce((acc, piece) => {
      acc[piece.position] = piece
      return acc
    }, {} as Record<string, Piece>)
  }

  resetRules = () => {
    this.pieces = Object.values(this.pieces).reduce((acc, piece) => {
      piece.hidden = false
      piece.takeable = true
      piece.disabled = false
      piece.renderName = piece.name
      acc[piece.position] = piece
      return acc
    }, {} as Record<string, Piece>)
  }
}
