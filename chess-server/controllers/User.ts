import { IUser } from 'chess-common'
import express from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
const router = express.Router()

const create = (req: { body: IUser }, res) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    password: req.body.password,
    lastLogin: new Date(),
    email: null,
    picture: null,
    matches: [],
  })
  user.save()
  res.send(user)
}

const get = (req: { params: { id: string } }, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.send('Invalid ID').status(400)
    }

    res.send(user)
  })
}

export default { create, get }
