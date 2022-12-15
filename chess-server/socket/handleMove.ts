import { IUser, Board, Piece, ChessStats, Move } from 'chess-common'
import { IoType } from '..'
import { BoardModel } from '../models/Board.js'
import { UserModel } from '../models/User.js'

export async function handleMove(move: Move, io: IoType) {
    move.time = new Date()
    try {
      let board = await BoardModel.findById(move.boardId).populate<{white: IUser, black: IUser}>([
        {
          path: 'white black',
          model: 'User',
        }, {
          path: 'messages',
          populate: {
            path: 'user',
            model: 'User',
          },
        }
      ])
      move.id = board.moves.length

      if (!board) throw Error(`Board not found for ${move.player}`)
      if(board.status !== 'playing') throw Error(`Board not playing for ${move.player}`)
      if (!Object.values(board.pieces).some(piece => piece.moves.valid.some((valid) => piece.position === move.from && piece.name === move.piece.name && valid == move.to))) throw Error(`Invalid Move: ${move.piece}${move.from}-${move.to}, not found on board ${move.boardId}`)

      const boardClass = Object.assign(new Board(move.boardId), board.toObject())
      boardClass.pieces = {}
      Object.values(board.pieces).forEach((piece) => {
        boardClass.pieces[piece.position] = Object.assign(new Piece('p', 'a1'), piece)
      })

      boardClass.handleMove(move)

      board.currentPlayer = boardClass.currentPlayer
      board.moves = boardClass.moves
      board.isCheck = boardClass.isCheck
      board.isCheckmate = boardClass.isCheckmate
      board.isStalemate = boardClass.isStalemate
      board.pieces = boardClass.pieces
      board.capturedPieces = boardClass.capturedPieces
      board.round = boardClass.round
      board.whiteTime = boardClass.whiteTime
      board.blackTime = boardClass.blackTime
      board.lastMoveDate = boardClass.lastMoveDate
      await board.save()

      if (board.isCheckmate || board.isStalemate) await scoreBoard(move.boardId)

      board = await BoardModel.findById(move.boardId).populate<{white: IUser, black: IUser}>(['white', 'black'])

      io.to(move.boardId).emit('board', Object.assign(new Board(move.boardId), board.toObject()))

    } catch (error) {
      console.log(error)
    }
  }

export const scoreBoard = async (boardId: string) => {
  let board = await BoardModel.findById(boardId).populate<{white: IUser, black: IUser}>([
    {
      path: 'white black',
      model: 'User',
    }, {
      path: 'messages',
      populate: {
        path: 'user',
        model: 'User',
      },
    }
  ])

  if(board.isCheckmate) {
    board.status = 'finished'
    board.winner = board.currentPlayer === 'white' ? board.black : board.white
    board.loser = board.currentPlayer === 'black' ? board.black : board.white

    const winnerPlayer = await UserModel.findById(board.winner._id)
    const loserPlayer = await UserModel.findById(board.loser._id)

    if(!winnerPlayer || !loserPlayer) throw Error('Winner or loser not found!')

    winnerPlayer.stats[board.type] = calculateStats(board.winner.stats[board.type], board.loser.stats[board.type], 1)
    await winnerPlayer.save()

    loserPlayer.stats[board.type] = calculateStats(board.loser.stats[board.type], board.winner.stats[board.type], 0)
    await loserPlayer.save()

    await board.save()
  }

  if(board.isStalemate) {
    board.status = 'finished'
    board.winner = null
    board.loser = null

    const whitePlayer = await UserModel.findById(board.white._id)
    const blackPlayer = await UserModel.findById(board.white._id)

    if(!whitePlayer || !blackPlayer) throw Error('White or black not found!')

    whitePlayer.stats[board.type] = calculateStats(whitePlayer.stats[board.type], blackPlayer.stats[board.type], 0.5)
    await whitePlayer.save()

    blackPlayer.stats[board.type] = calculateStats(blackPlayer.stats[board.type], whitePlayer.stats[board.type], 0.5)
    await blackPlayer.save()

    await board.save()
  }
}

const calculateStats = (prevStats: ChessStats, enemyPrevStats: ChessStats, result: (0 | 0.5 | 1)): ChessStats => {
  const expectedScore = 1 / (1 + 10 ** ((enemyPrevStats.elo - prevStats.elo) / 400))
  const newElo = Math.floor(prevStats.elo + 32 * (result - expectedScore))
  const newStreak = result === 1 ? prevStats.streak + 1 : 0

  return {
    elo: newElo,
    wins: prevStats.wins + (result === 1 ? 1 : 0),
    losses: prevStats.losses + (result === 0 ? 1 : 0),
    draws: prevStats.draws + (result === 0.5 ? 1 : 0),
    streak: newStreak,
  }
}
