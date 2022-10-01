import { useParams } from 'react-router'
import { useSocket } from '../api/socket'
import BoardNode from '../components/BoardNode'

const Game = () => {
  const { move, join } = useSocket()

  const { id } = useParams() as { id: string }
  join(id)

  return (
    <BoardNode move={move} />
  )
}

export default Game
