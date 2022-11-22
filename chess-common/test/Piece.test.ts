import { describe, expect, test } from '@jest/globals'
import { Board } from '../src/Board'
import { Piece } from '../src/Piece'
import { Annotation } from '../src/Position'

describe('constructor', () => {
  test('pawn', () => {
    const piece = new Piece('P', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('pawn')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('rook', () => {
    const piece = new Piece('R', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('rook')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('knight', () => {
    const piece = new Piece('N', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('knight')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('bishop', () => {
    const piece = new Piece('B', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('bishop')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('queen', () => {
    const piece = new Piece('Q', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('queen')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('king', () => {
    const piece = new Piece('K', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('king')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('black', () => {
    const piece = new Piece('k', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('king')
    expect(piece.color).toBe('black')
    expect(piece.position).toBe('a2')
  })

  test('invalid piece', () => {
    expect(() => new Piece('invalid' as any, 'a2')).toThrowError()
  })

  test('invalid position', () => {
    expect(() => new Piece('k', 'invalid' as Annotation)).toThrowError()
  })
})

describe('setDirections', () => {
  describe('pawn', () => {
    test('white', () => {
      const piece = new Piece('P', 'a2')
      expect(piece.directions.move).toEqual([['up']])
      expect(piece.directions.capture).toEqual([['up', 'left'], ['up', 'right']])
    })

    test('black', () => {
      const piece = new Piece('p', 'a2')
      expect(piece.directions.move).toEqual([['down']])
      expect(piece.directions.capture).toEqual([['down', 'left'], ['down', 'right']])
    })
  })

  test('rook', () => {
    const rook = new Piece('R', 'e2')
    const directions = [['up'], ['right'], ['down'], ['left']]

    expect(rook.directions.move).toEqual(directions)
    expect(rook.directions.capture).toEqual(directions)
  })

  test('knight', () => {
    const knight = new Piece('N', 'e2')
    const directions = [
      ['up', 'up', 'left'],
      ['up', 'up', 'right'],
      ['down', 'down', 'left'],
      ['down', 'down', 'right'],
      ['left', 'left', 'up'],
      ['left', 'left', 'down'],
      ['right', 'right', 'up'],
      ['right', 'right', 'down'],
    ]

    expect(knight.directions.move).toEqual(directions)
    expect(knight.directions.capture).toEqual(directions)
  })

  test('bishop', () => {
    const bishop = new Piece('B', 'e2')
    const directions = [
      ['up', 'left'],
      ['up', 'right'],
      ['right', 'down'],
      ['down', 'left'],
    ]

    expect(bishop.directions.move).toEqual(directions)
    expect(bishop.directions.capture).toEqual(directions)
  })

  test('queen', () => {
    const queen = new Piece('Q', 'e2')
    const directions = [
      ['up', 'left'],
      ['up'],
      ['up', 'right'],
      ['right'],
      ['right', 'down'],
      ['down'],
      ['down', 'left'],
      ['left'],
    ]

    expect(queen.directions.move).toEqual(directions)
    expect(queen.directions.capture).toEqual(directions)
  })

  test('king', () => {
    const king = new Piece('K', 'e2')
    const directions = [
      ['up', 'left'],
      ['up'],
      ['up', 'right'],
      ['right'],
      ['right', 'down'],
      ['down'],
      ['down', 'left'],
      ['left'],
    ]

    expect(king.directions.move).toEqual(directions)
    expect(king.directions.capture).toEqual(directions)
  })
})

describe('setRange', () => {
  test('pawn', () => {
    const pawn = new Piece('P', 'e2')

    expect(pawn.range).toStrictEqual({ move: 2, capture: 1 })
  })

  test('rook', () => {
    const rook = new Piece('R', 'e2')

    expect(rook.range).toStrictEqual({ move: 8, capture: 8 })
  })

  test('knight', () => {
    const knight = new Piece('N', 'e2')

    expect(knight.range).toStrictEqual({ move: 1, capture: 1 })
  })

  test('bishop', () => {
    const bishop = new Piece('B', 'e2')

    expect(bishop.range).toStrictEqual({ move: 8, capture: 8 })
  })

  test('queen', () => {
    const queen = new Piece('Q', 'e2')

    expect(queen.range).toStrictEqual({ move: 8, capture: 8 })
  })

  test('king', () => {
    const king = new Piece('K', 'e2')

    expect(king.range).toStrictEqual({ move: 1, capture: 1 })
  })
})

describe('setUnicode', () => {
  describe('white', () => {
    test('pawn', () => {
      const piece = new Piece('P', 'e2')

      expect(piece.unicode).toBe('♙')
    })

    test('rook', () => {
      const piece = new Piece('R', 'e2')

      expect(piece.unicode).toBe('♖')
    })

    test('knight', () => {
      const piece = new Piece('N', 'e2')

      expect(piece.unicode).toBe('♘')
    })

    test('bishop', () => {
      const piece = new Piece('B', 'e2')

      expect(piece.unicode).toBe('♗')
    })

    test('queen', () => {
      const piece = new Piece('Q', 'e2')

      expect(piece.unicode).toBe('♕')
    })

    test('king', () => {
      const piece = new Piece('K', 'e2')

      expect(piece.unicode).toBe('♔')
    })
  })

  describe('black', () => {
    test('pawn', () => {
      const piece = new Piece('p', 'e2')

      expect(piece.unicode).toBe('♟')
    })

    test('rook', () => {
      const piece = new Piece('r', 'e2')

      expect(piece.unicode).toBe('♜')
    })

    test('knight', () => {
      const piece = new Piece('n', 'e2')

      expect(piece.unicode).toBe('♞')
    })

    test('bishop', () => {
      const piece = new Piece('b', 'e2')

      expect(piece.unicode).toBe('♝')
    })

    test('queen', () => {
      const piece = new Piece('q', 'e2')

      expect(piece.unicode).toBe('♛')
    })

    test('king', () => {
      const piece = new Piece('k', 'e2')

      expect(piece.unicode).toBe('♚')
    })
  })
})

describe('moveTo', () => {
  test('normal', () => {
    const board = new Board('1', 'teszt', true, '8/8/8/8/8/8/4P3/8')
    const piece = [...Object.values(board.pieces)][0]

    piece.moveTo('e4', board)

    expect(piece.position).toBe('e4')
  })

  describe('promotion', () => {
    test('white', () => {
      const board = new Board('1', 'teszt', true, '8/4P3/8/8/8/8/8/8')
      const piece = [...Object.values(board.pieces)][0]

      piece.moveTo('e8', board)

      expect(piece.position).toBe('e8')
      expect(piece.name).toBe('queen')
    })

    test('black', () => {
      const board = new Board('1', 'teszt', true, '8/8/8/8/8/8/4p3/8')
      const piece = [...Object.values(board.pieces)][0]

      piece.moveTo('e1', board)

      expect(piece.position).toBe('e1')
      expect(piece.name).toBe('queen')
    })
  })

  // TODO: en passant test
  describe('en passant', () => {
    test('white', () => {
      const board = new Board('1', 'teszt', true, '8/8/8/8/4pP2/8/8/8')
      const piece = [...Object.values(board.pieces)][0]

      piece.moveTo('e6', board)

      expect(piece.position).toBe('e6')
    })

    test('black', () => {
      const board = new Board('1', 'teszt', true, '8/8/8/8/4Pp2/8/8/8')
      const piece = [...Object.values(board.pieces)][1]

      piece.moveTo('e3', board)

      expect(piece.position).toBe('e3')
    })
  })

  describe('castling', () => {
    describe('king side', () => {
      test('white', () => {
        const board = new Board('1', 'teszt', true, '8/8/8/8/8/8/8/4K2R')
        const king = board.getKing('white')

        king?.moveTo('g1', board)

        const rook = board.getPiece('h1')

        expect(king?.position).toBe('g1')
        expect(rook.position).toBe('f1')
      })

      test('black', () => {
        const board = new Board('1', 'teszt', true, '4k2r/8/8/8/8/8/8/8')
        const king = board.getKing('black')

        king?.moveTo('g8', board)

        const rook = board.getPiece('h8')

        expect(king?.position).toBe('g8')
        expect(rook.position).toBe('f8')
      })
    })

    describe('queen side', () => {
      test('white', () => {
        const board = new Board('1', 'teszt', true, '8/8/8/8/8/8/8/R3K3')
        const king = board.getKing('white')

        king?.moveTo('c1', board)

        const rook = board.getPiece('a1')

        expect(king?.position).toBe('c1')
        expect(rook.position).toBe('d1')
      })

      test('black', () => {
        const board = new Board('1', 'teszt', true, 'r3k3/8/8/8/8/8/8/8')
        const king = board.getKing('black')

        king?.moveTo('c8', board)

        const rook = board.getPiece('a8')

        expect(king?.position).toBe('c8')
        expect(rook.position).toBe('d8')
      })
    })
  })
})
