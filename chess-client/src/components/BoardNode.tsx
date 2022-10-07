import './Board.css'

import classNames from 'classnames'
import React from 'react'
import { Annotation, Move } from 'chess-common'
import { Grid, GridItem, Heading, useToast } from '@chakra-ui/react'
import { useReward } from 'react-rewards'
import PieceNode from './PieceNode'
import { useAppSelector } from '../store'
import Chat from './Chat'
import { useSocket } from '../store/socket'

// eslint-disable import/no-named-as-default
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
const BoardNode = ({ move }: { move: (movement: Move) => void }) => {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

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
  const { user } = useSocket()

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

  return (
    <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(12, 1fr)" marginLeft={4} justifyContent="start">
      <Heading as="h1" size="xl">
        You are: {board.players[0] === user ? 'White' : board.players[1] === user ? 'Black' : 'Spectator'}
      </Heading>
      <Heading>
        Turn: {board.currentPlayer === 'white' ? 'White' : 'Black'}
      </Heading>
      <GridItem rowSpan={1} colSpan={6} className="board">
        {Array.from(Array(8).keys()).reverse().map((row) => (
          cols.map((letter, col) => (
            <div
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
      <GridItem rowSpan={1} colSpan={2} className="prev-moves">
        { board.moves.map((move) => (
          // TODO unique keys
          <li key={move.piece + move.from + move.to}>
            {`${move.piece}${move.from}-${move.to}`}
          </li>
        )) }
      </GridItem>

      <GridItem marginTop={4} rowSpan={1} colSpan={8}>
        {board.players.includes(user) && <Chat messages={board.messages} />}
      </GridItem>
    </Grid>
  )
}

export default BoardNode
