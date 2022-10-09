import express from 'express'
import controller from '../controllers/User.js'

const router = express.Router()

router.post('/', controller.create)
router.get('/:id', controller.get)

export default router
