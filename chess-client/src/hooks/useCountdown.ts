import { Board, ColorTypes } from 'chess-common'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

// TODO fix 10sec freeze on move
// TODO fix invalid date at start of game
export const useCountdown = (board: Board, playerColor : ColorTypes) => {
  const deltaTime = dayjs().diff(dayjs(board.moves[board.moves.length - 1]?.time), 'seconds')
  const isActivePlayer = board.currentPlayer === playerColor

  const startTime = (board.currentPlayer === 'white' ? board.whiteTime : board.blackTime) - (isActivePlayer ? deltaTime : 0)
  const [timeLeft, setTimeLeft] = useState(startTime)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1 + (isActivePlayer ? 0 : 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const formattedTime = timeLeft <= 0 ? '00:00' : dayjs().startOf('day').minute(0).second(timeLeft)
    .format('mm:ss')

  return { timeLeft: formattedTime }
}
