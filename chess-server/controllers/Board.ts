import { Board, GameType, IUser } from 'chess-common'
import express from 'express'
import mongoose from 'mongoose'
import { BoardModel } from '../models/Board.js'
import { Encrypt } from '../utils/Encrypt.js'
import { v4 } from 'uuid'
import { Rule } from 'chess-common/lib/Board.js'

const create = async (req: { body: { pieces: string, type: GameType, rules: Rule[] } }, res) => {

  const boardClass = new Board('-1', req.body.pieces, req.body.type, false, req.body.rules)
  const board = new BoardModel({
    _id: new mongoose.Types.ObjectId(),
    white: null,
    black: null,
    moves: [],
    messages: [],
    spectators: [],
    winner: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    currentPlayer: 'white',
    pieces: boardClass.pieces,
    status: 'waiting',
    rules: req.body.rules,
    type: req.body.type,
  });

  await board.save();
  res.send(board._id).status(200)
}

const getAll = async (req, res) => {
  const boards = await BoardModel.find().populate(['white', 'black']);
  res.send(boards.filter((board) => board.status !== 'finished')).status(200);
}

export default { create, getAll }
