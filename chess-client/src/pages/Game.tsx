import React from 'react'
import { useParams } from 'react-router'
import { useSocket } from '../store/socket'
import BoardNode from '../components/BoardNode'

const Game = () => {
  const { join } = useSocket()
  const { id } = useParams() as { id: string }

  const user = sessionStorage.getItem('user') as string

  if (!user) {
    return null
  }

  join(id)

  return (
    <BoardNode />
  )
}

export default Game
