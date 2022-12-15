import React from 'react'
import { useParams } from 'react-router'
import {
  Heading, Button, Grid, GridItem, Tag, Box, useToast, useBoolean, Text, HStack, VStack, useColorMode,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { IUser } from 'chess-common'
import throttle from 'throttleit'
import { useTimer } from 'react-timer-hook'
import dayjs from 'dayjs'
import BoardNode from '../components/BoardNode'
import { useAppSelector } from '../store'
import Chat from '../components/Chat'
import UserNode from '../components/UserNode'
import useTranslate from '../hooks/useTranslate'
import Rules from '../components/Rules'
import { useSocket } from '../store/socket'

const Game = () => {
  const { id } = useParams() as { id: string }
  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)
  const toast = useToast()
  const [whiteView, setWhiteView] = useBoolean(board.black?._id !== user._id)
  const t = useTranslate()
  const { colorMode } = useColorMode()
  const { timesover, join, leave } = useSocket()

  const whiteTimeExpiryDate = (board.currentPlayer === 'white' && board.lastMoveDate ? dayjs(board.lastMoveDate) : dayjs()).add(board.whiteTime, 'seconds').toDate()
  const blackTimeExpiryDate = (board.currentPlayer === 'black' && board.lastMoveDate ? dayjs(board.lastMoveDate) : dayjs()).add(board.blackTime, 'seconds').toDate()

  const { minutes: whiteMinutes, seconds: whiteSeconds, pause: pauseWhiteTimer, restart: resetWhiteTimer } = useTimer(
    { expiryTimestamp: whiteTimeExpiryDate },
  )
  const { minutes: blackMinutes, seconds: blackSeconds, pause: pauseBlackTimer, restart: resetBlackTimer } = useTimer(
    { expiryTimestamp: blackTimeExpiryDate },
  )

  const handleCopyCode = () => {
    navigator.clipboard.writeText(id)
    toast({
      title: t('game.copied.title'),
      description: t('game.copied.message'),
      status: 'success',
      duration: 3000,
    })
  }

  const formatTime = (minutes: number, seconds: number) => {
    const minutesString = minutes < 10 ? `0${minutes}` : minutes
    const secondsString = seconds < 10 ? `0${seconds}` : seconds
    return `${minutesString}:${secondsString}`
  }

  React.useEffect(() => {
    join(id)
    return () => {
      leave(id)
    }
  }, [])

  React.useEffect(() => {
    if (board.isCheckmate) {
      const didILose = board.currentPlayer === 'black' && board.black._id === user._id
      toast({
        title: 'Game Over',
        description: `${board.currentPlayer === 'white' ? 'Black' : 'White'} wins!`,
        status: `${didILose ? 'error' : 'success'}`,
        duration: 3000,
        isClosable: true,
      })
    }

    if (board.isStalemate) {
      toast({
        title: 'Game Over',
        description: 'Stalemate!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [board.isCheckmate, board.isStalemate])

  React.useEffect(() => {
    if (!board.lastMoveDate) {
      resetWhiteTimer(dayjs().add(board.whiteTime, 'seconds').toDate(), false)
      resetBlackTimer(dayjs().add(board.blackTime, 'seconds').toDate(), false)
      return
    }

    if (board.currentPlayer === 'white') {
      resetWhiteTimer(dayjs(board.lastMoveDate).add(board.whiteTime, 'seconds').toDate())
      pauseBlackTimer()
    } else {
      resetBlackTimer(dayjs(board.lastMoveDate).add(board.blackTime, 'seconds').toDate())
      pauseWhiteTimer()
    }
  }, [board])

  React.useEffect(() => {
    if (board.time === -1 || board.status !== 'playing') return

    if (whiteMinutes === 0 && whiteSeconds === 0) {
      timesover('white')
    }

    if (blackMinutes === 0 && blackSeconds === 0) {
      timesover('black')
    }
  }, [whiteMinutes, whiteSeconds, blackMinutes, blackSeconds])

  if (!board._id) {
    return (
      <Box>
        <Heading justifyContent="center">
          <HStack justifyContent="center">
            <Heading size="lg" marginRight="2">{t('game.loading')}</Heading>
            <Box className="dot-elastic align-self-end" />
          </HStack>
        </Heading>
      </Box>
    )
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
      "info noneL1 white white"
      "noneL noneL letters noneR"
      "noneL noneL chat chat"`}
      templateColumns="0.5fr 0.001fr 0.05fr 0.2fr"
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
              {board.spectators.filter((id, index, self) => self.indexOf(id) === index).length}
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
          <Rules rules={board.rules} timeout={board.rule_timeout} frequency={board.rule_frequency} round={board.round} />
        </VStack>
      </GridItem>

      <GridItem area={whiteView ? 'black' : 'white'}>
        <HStack>
          <Text hidden={board.time === -1} border="1px solid grey" width="5rem" borderRadius="md" style={{ display: 'flex', justifyContent: 'center' }}>{formatTime(blackMinutes, blackSeconds)}</Text>
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

      <GridItem area="numbers" className="coord-numbers" pointerEvents="none">
        <Box display="flex" flexDirection="column">
          {(whiteView ? '87654321' : '12345678').split('').map((n) => (
            <Text key={n} fontSize="1.3rem" textAlign="center" display="flex" alignItems="center" minHeight="64px">{n}</Text>
          ))}
        </Box>
      </GridItem>

      <GridItem area="letters" className="coord-letters p-0 m-0" pointerEvents="none">
        <Box display="flex" flexDirection="row">
          {(whiteView ? 'abcdefgh' : 'hgfedcba').split('').map((n) => (
            <Text key={n} fontSize="1.3rem" textAlign="center" display="flex" justifyContent="center" minWidth="64px">{n}</Text>
          ))}
        </Box>
      </GridItem>

      <GridItem area="board" className="board">
        <BoardNode whiteView={whiteView} />
      </GridItem>

      <GridItem area="history" minHeight="1fr" width="14rem" border="1px solid grey" borderRadius="md" backgroundColor="gray.400">
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(20, 1fr)">
          { Object.values(board.pieces).every((p) => !p.hidden) && board.moves.map((move) => (
            <GridItem key={move.id}>
              <div>
                {/* {getRender(move.piece)} */}
              </div>
              <Text color="black" textAlign="center">
                {move.piece.unicode}
                {`${move.from}-${move.to}`}
              </Text>
            </GridItem>
          )) }
        </Grid>
      </GridItem>

      <GridItem area={whiteView ? 'white' : 'black'}>
        <HStack>
          <Text hidden={board.time === -1} border="1px solid grey" width="5rem" borderRadius="md" style={{ display: 'flex', justifyContent: 'center' }}>{formatTime(whiteMinutes, whiteSeconds)}</Text>
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
        <Chat messages={board.messages} readonly={board.status !== 'playing'} black={board.black as unknown as IUser} white={board.white as unknown as IUser} />
      </GridItem>
    </Grid>
  )
}

export default Game
