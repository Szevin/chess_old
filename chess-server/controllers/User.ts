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
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    password: await Encrypt.encrypt(req.body.password),
    email: req.body.email,
  })
  await user.save()
  res.send(user).status(201)
}

const login = async (req: { body: { name: string, password: string }}, res ) => {
  const user = await UserModel.findOne({ name: req.body.name })

  if(!user || !(await Encrypt.compare(req.body.password, user.password))) {
    res.send('Invalid username or password!').status(404)
    return
  }

  user.lastLogin = new Date()
  await user.save()
  res.send(user).status(200)
}

const get = async (req: { params: { id: string } }, res) => {
  const user = await UserModel.findById(req.params.id)

  res.send(user)
}

const getAll = async (req, res) => {
  const users = await UserModel.find()

  res.send(users)
}

export default { create, login, get, getAll }
