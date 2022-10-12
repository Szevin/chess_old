import { IUser } from 'chess-common'
import express from 'express'
import mongoose from 'mongoose'
import { BoardModel } from '../models/Board.js'
import { Encrypt } from '../utils/Encrypt.js'

const create = async (req: { body: { user: string, color: 'white' | 'black' } }, res) => {

  const board = new BoardModel({
    white: null,
    black: null,
    moves: [],
    messages: [],
    spectators: [],
    status: 'waiting',
  });

  await board.save();
  res.send(board._id).status(200)
}

export default { create }
