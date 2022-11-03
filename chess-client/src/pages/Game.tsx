import React from 'react'
import { useParams } from 'react-router'
import {
  Heading, HStack, Button, Grid, GridItem, Tag, Box, useToast, useBoolean, Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { IUser } from 'chess-common'
import throttle from 'throttleit'
import BoardNode from '../components/BoardNode'
import { useAppSelector } from '../store'
import Chat from '../components/Chat'
import UserNode from '../components/UserNode'
// import UserNode from '../components/UserNode'

const Game = () => {
  const { id } = useParams() as { id: string }
  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)
  const toast = useToast()
  const [whiteView, setWhiteView] = useBoolean(board.black?._id !== user._id)
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
        <Box marginTop="2" display="flex" justifyContent="center">
          <Grid templateRows="repeat(2, 1fr)">
            <GridItem>
              <Heading size="md">
                Code: {board._id}
              </Heading>
            </GridItem>
            <GridItem display="flex" justifyContent="center">
              <Button size="md" backgroundColor="InfoBackground" onClick={handleCopyCode}>Copy</Button>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    )
  }

  return (
    <Grid templateRows="repeat(4, 0.1fr)" templateColumns="repeat(12, 1fr)" marginLeft={0} justifyContent="start">
      <GridItem colStart={3} marginBottom={2}>
        <UserNode active={board.currentPlayer === 'black'} user={board.black as unknown as IUser} />
      </GridItem>
      <GridItem>
        <Button
          size="sm"
          backgroundColor={whiteView ? 'white' : 'gray.400'}
          onClick={throttle(setWhiteView.toggle, 1000)}
          marginTop={2}
          marginLeft={2}
        >
          <ViewIcon />
        </Button>
        <Text>
          {board.rules[Math.floor((board.round / board.rule_frequency) % board.rules.length)]}
        </Text>
      </GridItem>
      <GridItem colSpan={2} colStart={9}>
        <Tag colorScheme="blue">
          <ViewIcon marginRight="1" />
          {board.spectators.length}
        </Tag>
      </GridItem>

      <GridItem colStart={3} colSpan={6} className="board">
        <BoardNode whiteView={whiteView} />
      </GridItem>
      <Grid width="14rem" border="1px solid grey" borderRadius="md" backgroundColor="gray.400" templateColumns="repeat(2, 1fr)" templateRows="repeat(20, 1fr)">
        { board.moves.map((move) => (
        // TODO unique keys
          <GridItem key={move.piece + move.from + move.to}>
            {`${move.piece}${move.from}-${move.to}`}
          </GridItem>
        )) }
      </Grid>
      <GridItem marginTop={2} colStart={3} rowStart={3}>
        <UserNode active={board.currentPlayer === 'white'} user={board.white as unknown as IUser} />
      </GridItem>

      <GridItem marginTop={4} colStart={3} colEnd={10} rowStart={4} rowSpan={1} hidden={![(board.white as IUser)._id, (board.black as IUser)._id].includes(user._id)}>
        <Chat messages={board.messages} readonly={board.status !== 'playing'} blackId={board?.black._id.toString() ?? ''} whiteId={board?.white._id.toString() ?? ''} />
      </GridItem>
    </Grid>
  )
}

export default Game
