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
import useTranslate from '../hooks/useTranslate'
// import UserNode from '../components/UserNode'

const Game = () => {
  const { id } = useParams() as { id: string }
  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)
  const toast = useToast()
  const [whiteView, setWhiteView] = useBoolean(board.black?._id !== user._id)
  const t = useTranslate()
  // const dispatch = useAppDispatch()
  // const { leave } = useSocket()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(id)
    toast({
      title: t('game.copied.title'),
      description: t('game.copied.message'),
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
            <Heading size="lg" marginRight="2">{t('game.waiting')}</Heading>
            <Box className="dot-elastic align-self-end" />
          </HStack>
        </Heading>
        <Box marginTop="2" display="flex" justifyContent="center">
          <Grid templateRows="repeat(2, 1fr)">
            <GridItem>
              <Heading size="md">
                {t('game.code')}: {board._id}
              </Heading>
            </GridItem>
            <GridItem display="flex" justifyContent="center">
              <Button size="md" backgroundColor="InfoBackground" onClick={handleCopyCode}>{t('game.copy')}</Button>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    )
  }

  return (
    <Grid templateRows="repeat(6, 0.1fr)" templateColumns="repeat(12, 1fr)" marginLeft={0} justifyContent="start">
      <GridItem colSpan={4}>
        <Text>
          {t(`game.rule.${board.rules[Math.floor((board.round / board.rule_frequency) % board.rules.length)]}`)}
        </Text>
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
      </GridItem>
      <GridItem colSpan={2} colStart={9}>
        <Tag colorScheme="blue">
          <ViewIcon marginRight="1" />
          {board.spectators.length}
        </Tag>
      </GridItem>

      <GridItem rowStart={2} colStart={3} marginBottom={2}>
        <UserNode active={board.currentPlayer === 'black'} user={board.black as unknown as IUser} />
      </GridItem>
      <GridItem rowStart={2} colStart={5}>
        <Text>
          {
          board.capturedPieces
            .filter((p) => p.color === 'white')
            .map((p) => p.unicode)
            .join('')
        }
        </Text>
      </GridItem>
      <GridItem rowStart={2} colStart={8}>
        <Text>{board.blackTime}</Text>
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

      <GridItem marginTop={2} colStart={3} rowStart={5}>
        <UserNode active={board.currentPlayer === 'white'} user={board.white as unknown as IUser} />
      </GridItem>
      <GridItem rowStart={5} colStart={5}>
        <Text>
          {
          board.capturedPieces
            .filter((p) => p.color === 'black')
            .map((p) => p.unicode)
            .join('')
        }
        </Text>
      </GridItem>
      <GridItem rowStart={5} colStart={8}>
        <Text>{board.whiteTime}</Text>
      </GridItem>

      <GridItem marginTop={4} colStart={3} colEnd={10} rowStart={6} rowSpan={1} hidden={![(board.white as IUser)._id, (board.black as IUser)._id].includes(user._id)}>
        <Chat messages={board.messages} readonly={board.status !== 'playing'} blackId={board?.black._id.toString() ?? ''} whiteId={board?.white._id.toString() ?? ''} />
      </GridItem>
    </Grid>
  )
}

export default Game
