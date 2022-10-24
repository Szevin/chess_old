import express from 'express'
import controller from '../controllers/User.js'

const router = express.Router()

router.post('/', controller.create)
router.post('/login', controller.login)
router.get('/:id', controller.get)
router.get('/', controller.getAll)

export default router
