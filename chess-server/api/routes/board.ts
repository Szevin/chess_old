import express from 'express'
import { Board } from '../../models/board.model';
const router = express.Router()

/**
 * @openapi
 * /api/board/:id:
 *   get:
 *     responses:
 *       200:
 *         description: Returns a board
 */
router.get('/:id', async (req, res) => {
  const board = await Board.findById(req.params.id)
  res.send(board)
})

/**
 * @openapi
 * /api/board/:id:
 *   post:
 *     responses:
 *       200:
 *         description: Creates a board
 */
router.post('/', async (req, res) => {
  const board = await Board.create(req.body)
  board.save()
  res.send(200)
})

export default router
