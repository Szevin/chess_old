import { describe, expect, test } from '@jest/globals'
import { Board } from '../src/Board'
import { Piece } from '../src/Piece'
import { Annotation } from '../src/Position'

describe('constructor', () => {
  test('pawn', () => {
    const piece = new Piece('pawn', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('pawn')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('rook', () => {
    const piece = new Piece('rook', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('rook')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('knight', () => {
    const piece = new Piece('knight', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('knight')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('bishop', () => {
    const piece = new Piece('bishop', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('bishop')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('queen', () => {
    const piece = new Piece('queen', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('queen')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('king', () => {
    const piece = new Piece('king', 'white', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('king')
    expect(piece.color).toBe('white')
    expect(piece.position).toBe('a2')
  })

  test('black', () => {
    const piece = new Piece('king', 'black', 'a2')
    expect(piece).toBeDefined()
    expect(piece.name).toBe('king')
    expect(piece.color).toBe('black')
    expect(piece.position).toBe('a2')
  })

  test('invalid name', () => {
    expect(() => new Piece('invalid' as any, 'white', 'a2')).toThrowError()
  })

  test('invalid color', () => {
    expect(() => new Piece('king', 'invalid' as any, 'a2')).toThrowError()
  })

  test('invalid position', () => {
    expect(() => new Piece('king', 'white', 'invalid' as Annotation)).toThrowError()
  })
})

describe('setDirections', () => {
  describe('pawn', () => {
    test('white', () => {
      const piece = new Piece('pawn', 'white', 'a2')
      expect(piece.directions.move).toEqual([['up']])
      expect(piece.directions.capture).toEqual([['up', 'left'], ['up', 'right']])
    })

    test('black', () => {
      const piece = new Piece('pawn', 'black', 'a2')
      expect(piece.directions.move).toEqual([['down']])
      expect(piece.directions.capture).toEqual([['down', 'left'], ['down', 'right']])
    })
  })

  test('rook', () => {
    const rook = new Piece('rook', 'white', 'e2')
    const directions = [['up'], ['right'], ['down'], ['left']]

    expect(rook.directions.move).toEqual(directions)
    expect(rook.directions.capture).toEqual(directions)
  })

  test('knight', () => {
    const knight = new Piece('knight', 'white', 'e2')
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
    const bishop = new Piece('bishop', 'white', 'e2')
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
    const queen = new Piece('queen', 'white', 'e2')
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
    const king = new Piece('king', 'white', 'e2')
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
    const pawn = new Piece('pawn', 'white', 'e2')

    expect(pawn.range).toBe(2)
  })

  test('rook', () => {
    const rook = new Piece('rook', 'white', 'e2')

    expect(rook.range).toBe(8)
  })

  test('knight', () => {
    const knight = new Piece('knight', 'white', 'e2')

    expect(knight.range).toBe(1)
  })

  test('bishop', () => {
    const bishop = new Piece('bishop', 'white', 'e2')

    expect(bishop.range).toBe(8)
  })

  test('queen', () => {
    const queen = new Piece('queen', 'white', 'e2')

    expect(queen.range).toBe(8)
  })

  test('king', () => {
    const king = new Piece('king', 'white', 'e2')

    expect(king.range).toBe(1)
  })
})

describe('setUnicode', () => {
  describe('white', () => {
    test('pawn', () => {
      const piece = new Piece('pawn', 'white', 'e2')

      expect(piece.unicode).toBe('♟')
    })

    test('rook', () => {
      const piece = new Piece('rook', 'white', 'e2')

      expect(piece.unicode).toBe('♜')
    })

    test('knight', () => {
      const piece = new Piece('knight', 'white', 'e2')

      expect(piece.unicode).toBe('♞')
    })

    test('bishop', () => {
      const piece = new Piece('bishop', 'white', 'e2')

      expect(piece.unicode).toBe('♝')
    })

    test('queen', () => {
      const piece = new Piece('queen', 'white', 'e2')

      expect(piece.unicode).toBe('♛')
    })

    test('king', () => {
      const piece = new Piece('king', 'white', 'e2')

      expect(piece.unicode).toBe('♚')
    })
  })

  describe('black', () => {
    test('pawn', () => {
      const piece = new Piece('pawn', 'black', 'e2')

      expect(piece.unicode).toBe('♙')
    })

    test('rook', () => {
      const piece = new Piece('rook', 'black', 'e2')

      expect(piece.unicode).toBe('♖')
    })

    test('knight', () => {
      const piece = new Piece('knight', 'black', 'e2')

      expect(piece.unicode).toBe('♘')
    })

    test('bishop', () => {
      const piece = new Piece('bishop', 'black', 'e2')

      expect(piece.unicode).toBe('♗')
    })

    test('queen', () => {
      const piece = new Piece('queen', 'black', 'e2')

      expect(piece.unicode).toBe('♕')
    })

    test('king', () => {
      const piece = new Piece('king', 'black', 'e2')

      expect(piece.unicode).toBe('♔')
    })
  })
})

describe('moveTo', () => {
  test('normal', () => {
    const board = new Board('1', [{ name: 'pawn', color: 'white', position: 'e2' }])
    const piece = board.pieces[0]

    piece.moveTo('e4', board)

    expect(piece.position).toBe('e4')
  })

  describe('promotion', () => {
    test('white', () => {
      const board = new Board('1', [{ name: 'pawn', color: 'white', position: 'e7' }])
      const piece = board.pieces[0]

      piece.moveTo('e8', board)

      expect(piece.position).toBe('e8')
      expect(piece.name).toBe('queen')
    })

    test('black', () => {
      const board = new Board('1', [{ name: 'pawn', color: 'black', position: 'e2' }])
      const piece = board.pieces[0]

      piece.moveTo('e1', board)

      expect(piece.position).toBe('e1')
      expect(piece.name).toBe('queen')
    })
  })

  // describe('en passant', () => {
  //   test('white', () => {
  //     const board = new Board('1', [
  //       { name: 'pawn', color: 'white', position: 'e5' },
  //       { name: 'pawn', color: 'black', position: 'd5' },
  //     ]);
  //     const piece = board.pieces[0];

  //     piece.moveTo('d6', board);

  //     expect(piece.position).toBe('d6');
  //   })

  //   test('black', () => {
  //     const board = new Board('1', [
  //       { name: 'pawn', color: 'white', position: 'e4' },
  //       { name: 'pawn', color: 'black', position: 'd4' },
  //     ]);
  //     const piece = board.pieces[1];

  //     expect(piece.position).toBe('e3');
  //   })

  // })

  describe('castling', () => {
    describe('king side', () => {
      test('white', () => {
        const board = new Board('1', [
          { name: 'king', color: 'white', position: 'e1' },
          { name: 'rook', color: 'white', position: 'h1' },
        ])
        const piece = board.pieces[0]

        piece.moveTo('g1', board)

        expect(piece.position).toBe('g1')
        expect(board.pieces[1].position).toBe('f1')
      })

      test('black', () => {
        const board = new Board('1', [
          { name: 'king', color: 'black', position: 'e8' },
          { name: 'rook', color: 'black', position: 'h8' },
        ])
        const piece = board.pieces[0]

        piece.moveTo('g8', board)

        expect(piece.position).toBe('g8')
        expect(board.pieces[1].position).toBe('f8')
      })
    })

    describe('queen side', () => {
      test('white', () => {
        const board = new Board('1', [
          { name: 'king', color: 'white', position: 'e1' },
          { name: 'rook', color: 'white', position: 'a1' },
        ])
        const piece = board.pieces[0]

        piece.moveTo('c1', board)

        expect(piece.position).toBe('c1')
        expect(board.pieces[1].position).toBe('d1')
      })

      test('black', () => {
        const board = new Board('1', [
          { name: 'king', color: 'black', position: 'e8' },
          { name: 'rook', color: 'black', position: 'a8' },
        ])
        const piece = board.pieces[0]

        piece.moveTo('c8', board)

        expect(piece.position).toBe('c8')
        expect(board.pieces[1].position).toBe('d8')
      })
    })
  })
})
