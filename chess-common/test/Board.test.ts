import {describe, expect, test} from '@jest/globals';
import { Board } from '../src/Board';

describe('constructor', () => {
  test('empty', () => {
    const board = new Board('1');
    expect(board).toBeDefined();
    expect(board.id).toBe('1');
    expect(board.pieces).toBeDefined();
    expect(board.pieces.length).toBe(32);
  });

  test('2 pawns', () => {
    const board = new Board(
      '1',
      [
        {name: 'pawn', color: 'white', position: 'a2'},
        {name: 'pawn', color: 'black', position: 'a7'},
      ]
      );
    expect(board.id).toBe('1');
    expect(board.pieces.length).toBe(2);

    const whitePawn = board.pieces.find(p => p.color === 'white');
    expect(whitePawn).toBeDefined();
    expect(whitePawn?.position).toBe('a2');

    const blackPawn = board.pieces.find(p => p.color === 'black');
    expect(blackPawn).toBeDefined();
    expect(blackPawn?.position).toBe('a7');
  });

  test('Error when two pieces with same position', () => {
    expect(() => new Board(
      '1',
      [
        {name: 'pawn', color: 'white', position: 'a2'},
        {name: 'pawn', color: 'black', position: 'a2'},
      ]
      )).toThrowError();
  })
});

describe('getEnemyColor', () => {
  test('white', () => {
    const board = new Board('1');
    expect(board.getEnemyColor()).toBe('black');
  });

  test('black', () => {
    const board = new Board('1');
    board.currentPlayer = 'black';
    expect(board.getEnemyColor()).toBe('white');
  });
});

describe('getKing', () => {
  test('white', () => {
    const board = new Board('1');
    const king = board.getKing('white');
    expect(king).toBeDefined();
    expect(king?.color).toBe('white');
    expect(king?.name).toBe('king');
    expect(king?.position).toBe('e1');
  });

  test('black', () => {
    const board = new Board('1');
    const king = board.getKing('black');
    expect(king).toBeDefined();
    expect(king?.color).toBe('black');
    expect(king?.name).toBe('king');
    expect(king?.position).toBe('e8');
  });
})

describe('getPiece', () => {
  test('white pawn', () => {
    const board = new Board('1');
    const piece = board.getPiece('a2');
    expect(piece).toBeDefined();
    expect(piece?.color).toBe('white');
    expect(piece?.name).toBe('pawn');
    expect(piece?.position).toBe('a2');
  });

  test('black pawn', () => {
    const board = new Board('1');
    const piece = board.getPiece('a7');
    expect(piece).toBeDefined();
    expect(piece?.color).toBe('black');
    expect(piece?.name).toBe('pawn');
    expect(piece?.position).toBe('a7');
  });

  test('no piece', () => {
    const board = new Board('1');
    const piece = board.getPiece('e4');
    expect(piece).toBeUndefined();
  });
})

describe('getEnemyPieces', () => {
  test('white', () => {
    const board = new Board('1');
    const pieces = board.getEnemyPieces();
    expect(pieces.length).toBe(16);
    expect(pieces.filter(p => p.color === 'white').length).toBe(0);
    expect(pieces.filter(p => p.color === 'black').length).toBe(16);
  });

  test('black', () => {
    const board = new Board('1');
    board.currentPlayer = 'black';
    const pieces = board.getEnemyPieces();
    expect(pieces.length).toBe(16);
    expect(pieces.filter(p => p.color === 'white').length).toBe(16);
    expect(pieces.filter(p => p.color === 'black').length).toBe(0);
  });
})

describe('getOwnPieces', () => {
  test('white', () => {
    const board = new Board('1');
    const pieces = board.getOwnPieces();
    expect(pieces.length).toBe(16);
    expect(pieces.filter(p => p.color === 'white').length).toBe(16);
    expect(pieces.filter(p => p.color === 'black').length).toBe(0);
  });

  test('black', () => {
    const board = new Board('1');
    board.currentPlayer = 'black';
    const pieces = board.getOwnPieces();
    expect(pieces.length).toBe(16);
    expect(pieces.filter(p => p.color === 'white').length).toBe(0);
    expect(pieces.filter(p => p.color === 'black').length).toBe(16);
  });
})
