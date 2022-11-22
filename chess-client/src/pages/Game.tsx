import React from 'react'
import { useParams } from 'react-router'
import {
  Heading, Button, Grid, GridItem, Tag, Box, useToast, useBoolean, Text, HStack, VStack, useColorMode,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { IUser } from 'chess-common'
import throttle from 'throttleit'
import BoardNode from '../components/BoardNode'
import { useAppSelector } from '../store'
import Chat from '../components/Chat'
import UserNode from '../components/UserNode'
import useTranslate from '../hooks/useTranslate'

const Game = () => {
  const { id } = useParams() as { id: string }
  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)
  const toast = useToast()
  const [whiteView, setWhiteView] = useBoolean(board.black?._id !== user._id)
  const t = useTranslate()
  const { colorMode } = useColorMode()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(id)
    toast({
      title: t('game.copied.title'),
      description: t('game.copied.message'),
      status: 'success',
      duration: 3000,
    })
  }

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
    <Grid
      templateAreas={`"noneU1 noneU1 black black"
      "info numbers board history"
      "info noneL1 letters noneR1"
      "noneL white white white"
      "noneL chat chat chat"`}
      templateColumns="0.4fr 0.001fr 0.05fr 0.2fr"
      templateRows="0.2fr 0.05fr 0.001fr 0.2fr 0.2fr"
      marginLeft={0}
      justifyContent="start"
      gap={2}
      backgroundColor={colorMode === 'light' ? 'whitesmoke' : 'blueviolet'}
    >
      <GridItem area="info">
        <VStack>
          <HStack>
            <Tag colorScheme="blue">
              <ViewIcon marginRight="1" />
              {board.spectators.length}
            </Tag>
            <Button
              size="sm"
              backgroundColor={colorMode === 'light' ? 'blueviolet' : 'gray.400'}
              onClick={throttle(setWhiteView.toggle, 1000)}
              marginTop={2}
              marginLeft={2}
            >
              <ViewIcon color={whiteView ? 'white' : 'black'} />
            </Button>
          </HStack>
          <Text>
            {board.rules.length > 0 && t(`game.rule.${board.rules[Math.floor((board.round / board.rule_frequency) % board.rules.length)]}`)}
          </Text>
        </VStack>
      </GridItem>

      <GridItem area="black">
        <HStack>
          <Text hidden={board.time === -1} border="1px solid grey" width="5rem" borderRadius="md" style={{ display: 'flex', justifyContent: 'center' }}>{board.blackTime}</Text>
          <UserNode active={board.currentPlayer === 'black'} user={board.black as unknown as IUser} />
          <Text>
            {
            board.capturedPieces
              .filter((p) => p.color === 'white')
              .map((p) => p.unicode)
              .join('')
          }
          </Text>
        </HStack>
      </GridItem>

      <GridItem area="numbers" className="coord-numbers">
        <Box display="flex" flexDirection="column">
          {['8', '7', '6', '5', '4', '3', '2', '1'].map((n) => (
            <Text key={n} fontSize="1.3rem" textAlign="center" display="flex" alignItems="center" minHeight="64px">{n}</Text>
          ))}
        </Box>
      </GridItem>

      <GridItem area="letters" className="coord-letters p-0 m-0">
        <Box display="flex" flexDirection="row">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((n) => (
            <Text key={n} fontSize="1.3rem" textAlign="center" display="flex" justifyContent="center" minWidth="64px">{n}</Text>
          ))}
        </Box>
      </GridItem>

      <GridItem area="board" className="board">
        <BoardNode whiteView={whiteView} />
      </GridItem>

      <GridItem area="history" minHeight="1fr" width="14rem" border="1px solid grey" borderRadius="md" backgroundColor="gray.400">
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(20, 1fr)">
          { board.moves.map((move) => (
            // TODO unique keys
            <GridItem key={move.piece.renderName + move.from + move.to}>
              <div>
                {/* {getRender(move.piece)} */}
              </div>
              <Text>
                {move.piece.unicode}
                {`${move.from}-${move.to}`}
              </Text>
            </GridItem>
          )) }
        </Grid>
      </GridItem>

      <GridItem area="white">
        <HStack>
          <Text hidden={board.time === -1} border="1px solid grey" width="5rem" borderRadius="md" style={{ display: 'flex', justifyContent: 'center' }}>{board.whiteTime}</Text>
          <UserNode active={board.currentPlayer === 'white'} user={board.white as unknown as IUser} />
          <Text>
            {
            board.capturedPieces
              .filter((p) => p.color === 'black')
              .map((p) => p.unicode)
              .join('')
        }
          </Text>
        </HStack>
      </GridItem>

      <GridItem area="chat" hidden={![(board.white as IUser)._id, (board.black as IUser)._id].includes(user._id)}>
        <Chat messages={board.messages} readonly={board.status !== 'playing'} blackId={board?.black._id.toString() ?? ''} whiteId={board?.white._id.toString() ?? ''} />
      </GridItem>
    </Grid>
  )
}

export default Game
