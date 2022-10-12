import { Board, IUser } from 'chess-common'
import express from 'express'
import mongoose from 'mongoose'
import { BoardModel } from '../models/Board.js'
import { Encrypt } from '../utils/Encrypt.js'
import { v4 } from 'uuid'

const create = async (req: { body: { user: string, color: 'white' | 'black' } }, res) => {

  const boardClass = new Board('-1')
  const board = new BoardModel({
    id: (Math.floor(Math.random() * 100000000)).toString(),
    white: null,
    black: null,
    moves: [],
    messages: [],
    spectators: [],
    pieces: boardClass.pieces,
    status: 'waiting',
  });

  await board.save();
  console.log(board.id)
  res.send(board.id).status(200)
}

export default { create }
