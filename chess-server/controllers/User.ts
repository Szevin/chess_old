import { IUser } from 'chess-common'
import express from 'express'
import mongoose from 'mongoose'
import { UserModel } from '../models/User.js'
import { Encrypt } from '../utils/Encrypt.js'

const create = async (req: { body: IUser }, res) => {
  const nameInUse = await UserModel.findOne({ name: req.body.name })
  if(nameInUse) {
    res.status(400).send('Name already in use')
    return
  }

  const user = new UserModel({
    id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    password: await Encrypt.encrypt(req.body.password),
    email: req.body.email,
  })
  await user.save()
  res.send(user).status(200)
}

const login = async (req: { body: { name: string, password: string }}, res ) => {
  const user = await UserModel.findOne({ name: req.body.name })

  if (!user) {
    res.send('User not found!').status(404)
    return
  }

  if(!(await Encrypt.compare(req.body.password, user.password))) {
    res.send('Invalid password!').status(412)
    return
  }

  res.send(user).status(200)
}

const get = (req: { params: { id: string } }, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if (err) {
      res.send('Invalid ID').status(400)
    }

    res.send(user)
  })
}

export default { create, login, get }
