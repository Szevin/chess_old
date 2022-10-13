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
    winner: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    currentPlayer: 'white',
    pieces: boardClass.pieces,
    status: 'waiting',
  });

  await board.save();
  console.log(board.id)
  res.send(board.id).status(200)
}

const getAll = async (req, res) => {
  const boards = await BoardModel.find();
  res.send(boards.filter((board) => board.status !== 'finished')).status(200);
}

export default { create, getAll }
