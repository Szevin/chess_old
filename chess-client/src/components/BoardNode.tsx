import './Board.css'

import classNames from 'classnames'
import React from 'react'
import { Annotation, IUser } from 'chess-common'
import {
  Box, Grid, GridItem, Heading, HStack, Tag, useToast,
} from '@chakra-ui/react'
import { useReward } from 'react-rewards'
import { ViewIcon } from '@chakra-ui/icons'
import PieceNode from './PieceNode'
import { useAppSelector } from '../store'
import Chat from './Chat'
import { useSocket } from '../store/socket'
import UserNode from './UserNode'

// eslint-disable import/no-named-as-default
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
const BoardNode = () => {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  const { move } = useSocket()
  const toast = useToast()
  const { reward } = useReward('last', 'confetti', {
    lifetime: 300,
    elementCount: 100,
    elementSize: 15,
    angle: 90,
    startVelocity: 15,
    spread: 360,
  })
  const [selectedPosition, setselectedPosition] = React.useState<Annotation | null>(null)
  const [validMoves, setValidMoves] = React.useState<Array<Annotation>>([])

  const board = useAppSelector((state) => state.board)
  const user = sessionStorage.getItem('user') ?? ''

  React.useEffect(() => {
    if (!selectedPosition) {
      setValidMoves([])
      return
    }
    const piece = board.getPiece(selectedPosition)
    if (!piece) {
      setValidMoves([])
      return
    }

    setValidMoves(piece.moves.valid)
  }, [selectedPosition])

  const handleMove = (to: Annotation) => {
    if (!selectedPosition) return
    const piece = board.getPiece(selectedPosition)
    if (!piece) {
      return
    }

    if (!(piece.moves.valid).length || !piece.moves.valid.includes(to)) {
      setselectedPosition(null)
      return
    }

    move({
      from: selectedPosition,
      to,
      piece: piece.unicode,
      player: user,
    })
    setselectedPosition(null)
  }

  React.useEffect(() => {
    if (board.isCheckmate) {
      toast({
        title: 'Checkmate',
        description: `Checkmate! ${board.currentPlayer === 'white' ? 'black' : 'white'} wins!`,
        status: 'success',
        duration: null,
        isClosable: true,
      })

      reward()
    }

    if (board.isStalemate) {
      toast({
        title: 'Stalemate',
        description: 'Stalemate!',
        status: 'warning',
        duration: null,
        isClosable: true,
      })

      reward()
    }
  }, [board])

  if (board.players.length !== 2) {
    return (
      <Box>
        <Heading justifyContent="center">
          <HStack justifyContent="center">
            <Heading size="lg" marginRight="2">Waiting for opponent</Heading>
            <Box className="dot-elastic align-self-end" />
          </HStack>
        </Heading>
        <Heading marginTop="2" size="md" display="flex" justifyContent="center">
          Code: {board.id}
        </Heading>
      </Box>
    )
  }

  return (
    <Grid templateRows="repeat(30, 0.1fr)" templateColumns="repeat(12, 1fr)" marginLeft={4} justifyContent="start">
      <GridItem rowSpan={1} colSpan={10} justifyContent="center">
        <Heading justifyContent="center">
          Turn: {board.currentPlayer === 'white' ? 'White' : 'Black'}
        </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Tag colorScheme="blue">
          <ViewIcon marginRight="1" />
          {board.spectators.length}
        </Tag>
      </GridItem>
      <GridItem colSpan={1}>
        <UserNode user={{ name: board.players[0] } as IUser} />
      </GridItem>
      <GridItem rowSpan={1} colSpan={6} className="board">
        {Array.from(Array(8).keys()).reverse().map((row) => (
          cols.map((letter, col) => (
            <Box
              id={`${letter}${row + 1}` === board.moves.at(-1)?.to ? 'last' : ''}
              className={classNames({
                white: ((col % 2) && !(row % 2)) || (!(col % 2) && (row % 2)),
                black: !(((col % 2) && !(row % 2)) || (!(col % 2) && (row % 2))),
                valid: validMoves.includes((letter + (row + 1)) as Annotation),
                // last: [board.getLastMove()?.to.annotation, board.getLastMove()?.from.annotation].includes((letter + (row + 1)) as Annotation),
                check: board.isCheck
                && board.getKing(board.currentPlayer).position === (letter + (row + 1)) as Annotation,
              })}
              key={letter + row}
            />
          ))
        ))}
        { board.pieces.map((piece) => (
          <PieceNode
            key={piece.id}
            piece={piece}
            isDraggable={board.currentPlayer === piece.color && !board.isCheckmate && board.players[board.currentPlayer === 'white' ? 0 : 1] === user && board.players.includes(user)}
            onMove={handleMove}
            setselectedPosition={setselectedPosition}
          />
        ))}
      </GridItem>
      <Grid width="10rem" border="1px solid grey" borderRadius="md" backgroundColor="gray.400" templateColumns="repeat(2, 1fr)" templateRows="repeat(20, 1fr)">
        { board.moves.map((move) => (
          // TODO unique keys
          <GridItem key={move.piece + move.from + move.to}>
            {`${move.piece}${move.from}-${move.to}`}
          </GridItem>
        )) }
      </Grid>

      <GridItem marginTop={4} rowSpan={1} colSpan={8}>
        {board.players.includes(user) && <Chat messages={board.messages} />}
      </GridItem>
    </Grid>
  )
}

export default BoardNode
