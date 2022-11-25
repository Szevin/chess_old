import { Board, ColorTypes } from 'chess-common'
import { useEffect, useState } from 'react'

export const useCountdown = (board: Board, playerColor : ColorTypes) => {
  const [timeLeft, setTimeLeft] = useState(board.currentPlayer === 'white' ? board.whiteTime : board.blackTime)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1 + (board.currentPlayer === playerColor ? 0 : 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  return { timeLeft, setTimeLeft }
}
