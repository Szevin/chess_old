import express from 'express'
import controller from '../controllers/Board.js'

const router = express.Router()

router.post('/', controller.create)

export default router
