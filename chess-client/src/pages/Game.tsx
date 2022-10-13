import React from 'react'
import { useParams } from 'react-router'
import {
  Heading, HStack, Button, Grid, GridItem, Tag, Box, useToast,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { IUser } from 'chess-common'
import BoardNode from '../components/BoardNode'
import { useAppSelector } from '../store'
import Chat from '../components/Chat'
import UserNode from '../components/UserNode'

const Game = () => {
  const { id } = useParams() as { id: string }
  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)
  const toast = useToast()
  // const dispatch = useAppDispatch()
  // const { leave } = useSocket()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(id)
    toast({
      title: 'Copied',
      description: 'Game code copied to clipboard!',
      status: 'success',
      duration: 3000,
    })
  }

  // React.useEffect(() => () => {
  //   dispatch(clearBoard())
  //   leave(id)
  // }, [])

  if (board.status === 'waiting') {
    return (
      <Box>
        <Heading justifyContent="center">
          <HStack justifyContent="center">
            <Heading size="lg" marginRight="2">Waiting for opponent</Heading>
            <Box className="dot-elastic align-self-end" />
          </HStack>
        </Heading>
        <Heading marginTop="2" size="md" display="flex" justifyContent="center">
          Code: {board.id} <Button size="xs" backgroundColor="InfoBackground" onClick={handleCopyCode}>Copy</Button>
        </Heading>
      </Box>
    )
  }

  return (
    <Grid templateRows="repeat(4, 0.1fr)" templateColumns="repeat(12, 1fr)" marginLeft={4} justifyContent="start">
      <GridItem colStart={3} marginBottom={2}>
        <UserNode current={board.currentPlayer} color="black" user={{ name: board.black } as IUser} />
      </GridItem>
      <GridItem colSpan={2} colStart={9}>
        <Tag colorScheme="blue">
          <ViewIcon marginRight="1" />
          {board.spectators.length}
        </Tag>
      </GridItem>

      <GridItem colStart={3} colSpan={6} className="board">
        <BoardNode />
      </GridItem>
      <Grid width="10rem" border="1px solid grey" borderRadius="md" backgroundColor="gray.400" templateColumns="repeat(2, 1fr)" templateRows="repeat(20, 1fr)">
        { board.moves.map((move) => (
        // TODO unique keys
          <GridItem key={move.piece + move.from + move.to}>
            {`${move.piece}${move.from}-${move.to}`}
          </GridItem>
        )) }
      </Grid>
      <GridItem marginTop={2} colStart={3} rowStart={3}>
        <UserNode current={board.currentPlayer} color="white" user={{ name: board.white } as IUser} />
      </GridItem>

      <GridItem marginTop={4} rowSpan={1}>
        {[board.white, board.black].includes(user._id) && <Chat messages={board.messages} />}
      </GridItem>
    </Grid>
  )
}

export default Game
