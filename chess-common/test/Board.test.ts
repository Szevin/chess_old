/* eslint-disable no-underscore-dangle */
import { describe, expect, test } from '@jest/globals'
import dayjs from 'dayjs'
import { Board } from '../src/Board'
import { Annotation } from '../src/Position'

describe('constructor', () => {
  test('default', () => {
    const board = new Board('1')
    expect(board).toBeDefined()
    expect(board._id).toBe('1')
    expect(board.pieces).toBeDefined()
    expect(Object.values(board.pieces).length).toBe(32)
  })

  test('2 pawns', () => {
    const board = new Board(
      '1',
      'teszt',
      true,
      '8/p7/8/8/8/8/P7/8',
    )
    expect(board._id).toBe('1')
    expect(Object.values(board.pieces).length).toBe(2)

    const whitePawn = [...Object.values(board.pieces)].find((p) => p.color === 'white')
    expect(whitePawn).toBeDefined()
    expect(whitePawn?.position).toBe('a2')

    const blackPawn = [...Object.values(board.pieces)].find((p) => p.color === 'black')
    expect(blackPawn).toBeDefined()
    expect(blackPawn?.position).toBe('a7')
  })
})

describe('getEnemyColor', () => {
  test('white', () => {
    const board = new Board('1')
    expect(board.getEnemyColor()).toBe('black')
  })

  test('black', () => {
    const board = new Board('1')
    board.currentPlayer = 'black'
    expect(board.getEnemyColor()).toBe('white')
  })
})

describe('getKing', () => {
  test('white', () => {
    const board = new Board('1')
    const king = board.getKing('white')
    expect(king).toBeDefined()
    expect(king?.color).toBe('white')
    expect(king?.name).toBe('king')
    expect(king?.position).toBe('e1')
  })

  test('black', () => {
    const board = new Board('1')
    const king = board.getKing('black')
    expect(king).toBeDefined()
    expect(king?.color).toBe('black')
    expect(king?.name).toBe('king')
    expect(king?.position).toBe('e8')
  })
})

describe('getPiece', () => {
  test('white pawn', () => {
    const board = new Board('1')
    const piece = board.getPiece('a2')
    expect(piece).toBeDefined()
    expect(piece?.color).toBe('white')
    expect(piece?.name).toBe('pawn')
    expect(piece?.position).toBe('a2')
  })

  test('black pawn', () => {
    const board = new Board('1')
    const piece = board.getPiece('a7')
    expect(piece).toBeDefined()
    expect(piece?.color).toBe('black')
    expect(piece?.name).toBe('pawn')
    expect(piece?.position).toBe('a7')
  })

  test('no piece', () => {
    const board = new Board('1')
    const piece = board.getPiece('e4')
    expect(piece).toBeUndefined()
  })
})

describe('getEnemyPieces', () => {
  test('white', () => {
    const board = new Board('1')
    const pieces = board.getEnemyPieces()
    expect(pieces.length).toBe(16)
    expect(pieces.filter((p) => p.color === 'white').length).toBe(0)
    expect(pieces.filter((p) => p.color === 'black').length).toBe(16)
  })

  test('black', () => {
    const board = new Board('1')
    board.currentPlayer = 'black'
    const pieces = board.getEnemyPieces()
    expect(pieces.length).toBe(16)
    expect(pieces.filter((p) => p.color === 'white').length).toBe(16)
    expect(pieces.filter((p) => p.color === 'black').length).toBe(0)
  })
})

describe('getOwnPieces', () => {
  test('white', () => {
    const board = new Board('1')
    const pieces = board.getOwnPieces()
    expect(pieces.length).toBe(16)
    expect(pieces.filter((p) => p.color === 'white').length).toBe(16)
    expect(pieces.filter((p) => p.color === 'black').length).toBe(0)
  })

  test('black', () => {
    const board = new Board('1')
    board.currentPlayer = 'black'
    const pieces = board.getOwnPieces()
    expect(pieces.length).toBe(16)
    expect(pieces.filter((p) => p.color === 'white').length).toBe(0)
    expect(pieces.filter((p) => p.color === 'black').length).toBe(16)
  })

  describe('FEN', () => {
    test('FENtoMap', () => {
      const fen = '8/p7/8/8/8/8/P7/8'
      const map = Board.FENtoMap(fen)
      expect(Object.values(map).length).toBe(2)
      expect(map.a2).toBeDefined()
      expect(map.a7).toBeDefined()
    })

    test('MaptoFEN', () => {
      const fen = '11111111/1p111111/11111111/11111111/11111111/11111111/1P111111/11111111'
      const map = Board.FENtoMap(fen)
      expect(Board.MaptoFEN(map)).toBe(fen)
    })
  })

  describe('move', () => {
    test('normal', () => {
      const board = new Board('1')
      board.handleMove({
        from: 'a2',
        to: 'a4',
        boardId: '1',
        piece: board.pieces.a2,
        player: 'white',
        time: dayjs().toDate(),
      })

      expect(board.pieces.a2).toBeUndefined()
      expect(board.pieces.a3).toBeUndefined()
      expect(board.pieces.a4).toBeDefined()
    })

    test('capture', () => {
      const board = new Board('1')
      board.handleMove({
        from: 'a2',
        to: 'a4',
        boardId: '1',
        piece: board.pieces.a2,
        player: 'white',
        time: dayjs().toDate(),
      })
      board.handleMove({
        from: 'b7',
        to: 'b5',
        boardId: '1',
        piece: board.pieces.b7,
        player: 'black',
        time: dayjs().toDate(),
      })
      board.handleMove({
        from: 'a4',
        to: 'b5',
        boardId: '1',
        piece: board.pieces.a4,
        player: 'white',
        time: dayjs().toDate(),
      })

      expect(board.pieces.a2).toBeUndefined()
      expect(board.pieces.b7).toBeUndefined()
      expect(board.pieces.a4).toBeUndefined()
      expect(board.pieces.b5?.color).toBe('white')
    })

    test('en passant', () => {
      const board = new Board('1')
      board.handleMove({
        from: 'a2',
        to: 'a4',
        boardId: '1',
        piece: board.pieces.a2,
        player: 'white',
        time: dayjs().toDate(),
      })
      board.handleMove({
        from: 'b7',
        to: 'b5',
        boardId: '1',
        piece: board.pieces.b7,
        player: 'black',
        time: dayjs().toDate(),
      })
      board.handleMove({
        from: 'a4',
        to: 'a5',
        boardId: '1',
        piece: board.pieces.a4,
        player: 'white',
        time: dayjs().toDate(),
      })
      board.handleMove({
        from: 'b5',
        to: 'a6',
        boardId: '1',
        piece: board.pieces.b5,
        player: 'black',
        time: dayjs().toDate(),
      })

      expect(board.pieces.a2).toBeUndefined()
      expect(board.pieces.b7).toBeUndefined()
      expect(board.pieces.a4).toBeUndefined()
      expect(board.pieces.a5).toBeUndefined()
      expect(board.pieces.b5).toBeUndefined()
      expect(board.pieces.a6?.color).toBe('black')
    })

    test('invalid', () => {
      const board = new Board('1')
      board.handleMove({
        from: 'a2',
        to: 'a4',
        boardId: '1',
        piece: board.pieces.a2,
        player: 'white',
        time: dayjs().toDate(),
      })

      expect(() => {
        board.handleMove({
          from: 'a2',
          to: 'a4',
          boardId: '1',
          piece: board.pieces.a2,
          player: 'white',
          time: dayjs().toDate(),
        })
      }).toThrowError('Piece not found at a2')
    })
  })

  describe('gameOver', () => {
    test('black wins', () => {
      const board = new Board('1')
      const moves = [
        { from: 'g2', to: 'g4' },
        { from: 'e7', to: 'e5' },

        { from: 'f2', to: 'f3' },
        { from: 'd8', to: 'h4' },
      ] as { from: Annotation; to: Annotation }[]

      moves.forEach((move) => {
        board.handleMove({
          from: move.from,
          to: move.to,
          boardId: '1',
          piece: board.pieces[move.from],
          player: board.currentPlayer,
          time: dayjs().toDate(),
        })
      })

      expect(board.getOwnPieces().flatMap((p) => p.moves.valid)).toStrictEqual([])
      expect(board.isCheck).toBe(true)
      expect(board.isCheckmate).toBe(true)
    })

    test('white wins', () => {
      const board = new Board('1')

      const moves = [
        { from: 'e2', to: 'e4' },
        { from: 'e7', to: 'e5' },

        { from: 'f1', to: 'c4' },
        { from: 'c7', to: 'c5' },

        { from: 'd1', to: 'f3' },
        { from: 'd7', to: 'd6' },

        { from: 'f3', to: 'f7' },
      ] as { from: Annotation; to: Annotation }[]

      moves.forEach((m) => {
        board.handleMove({
          from: m.from,
          to: m.to,
          boardId: '1',
          piece: board.pieces[m.from],
          player: 'white',
          time: dayjs().toDate(),
        })

        expect(board.isCheck).toBe(true)
        expect(board.isCheckmate).toBe(true)
      })
    })

    test('stalemate', () => {
      const board = new Board('1')

      const moves = [
        { from: 'e2', to: 'e3' },
        { from: 'a7', to: 'a5' },

        { from: 'd1', to: 'h5' },
        { from: 'a8', to: 'a6' },

        { from: 'h5', to: 'a5' },
        { from: 'h7', to: 'h5' },

        { from: 'h2', to: 'h4' },
        { from: 'a6', to: 'h6' },

        { from: 'a5', to: 'd7' },
        { from: 'f7', to: 'f6' },

        { from: 'c7', to: 'd7' },
        { from: 'e8', to: 'f7' },

        { from: 'd7', to: 'b7' },
        { from: 'd8', to: 'd3' },

        { from: 'b7', to: 'b8' },
        { from: 'd3', to: 'h7' },

        { from: 'b8', to: 'c8' },
        { from: 'f7', to: 'g6' },

        { from: 'c8', to: 'e6' },
      ] as { from: Annotation; to: Annotation }[]

      moves.forEach((m) => {
        board.handleMove({
          from: m.from,
          to: m.to,
          boardId: '1',
          piece: board.pieces[m.from],
          player: board.currentPlayer,
          time: dayjs().toDate(),
        })
      })

      expect(board.isStalemate).toBe(true)
    })
  })
})
