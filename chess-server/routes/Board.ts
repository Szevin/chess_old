import express from 'express'
import controller from '../controllers/Board.js'

const router = express.Router()

router.post('/', controller.create)
router.get('/', controller.getAll)

export default router
