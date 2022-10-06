import {describe, expect, test} from '@jest/globals';
import { Board } from '../src/Board';

describe('Board', () => {
  test('create a new board', () => {
    const board = new Board('1');
    expect(board).toBeDefined();
  });
});
