import './Board.css'

import classNames from 'classnames'
import React from 'react'
import { Annotation, IUser, Piece } from 'chess-common'
import { Box, useColorMode } from '@chakra-ui/react'
// import { useReward } from 'react-rewards'
import dayjs from 'dayjs'
import PieceNode from './PieceNode'
import { useAppSelector } from '../store'
import { useSocket } from '../store/socket'

// eslint-disable import/no-named-as-default
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
const BoardNode = ({ whiteView } : { whiteView: boolean }) => {
  const cols = whiteView ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  const rows = whiteView ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]
  const { move } = useSocket()
  const { colorMode } = useColorMode()
  // const { reward } = useReward('last', 'confetti', {
  //   lifetime: 300,
  //   elementCount: 100,
  //   elementSize: 15,
  //   angle: 90,
  //   startVelocity: 15,
  //   spread: 360,
  // })
  const [selectedPosition, setselectedPosition] = React.useState<Annotation | null>(null)
  const [validMoves, setValidMoves] = React.useState<Array<Annotation>>([])

  const board = useAppSelector((state) => state.board)
  const user = useAppSelector((state) => state.user)

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
      piece: Object.assign(new Piece('p', 'a1'), piece),
      player: user.name,
      boardId: board._id,
      time: dayjs().toDate(),
    })
    setselectedPosition(null)
  }

  const isWhiteTile = (row: number, col: number) => {
    if (whiteView) {
      if (row % 2 === 0) {
        return col % 2 !== 0
      }
      return col % 2 === 0
    }

    if (row % 2 === 0) {
      return col % 2 === 0
    }
    return col % 2 !== 0
  }

  return (

    <>
      {rows.map((row) => (
        cols.map((letter, col) => (
          <Box
            backgroundColor={colorMode === 'light' ? (row + col) % 2 === 0 ? 'gray.500' : 'gray.200' : (row + col) % 2 === 0 ? 'gray.700' : 'gray.600'}
            id={`${letter}${row + 1}` === board.moves.at(-1)?.to ? 'last' : ''}
            className={classNames({
              white: isWhiteTile(row, col),
              black: !isWhiteTile(row, col),
              valid: validMoves.includes((letter + (row + 1)) as Annotation),
              last: board.moves.length && [board.moves[board.moves.length - 1].from, board.moves[board.moves.length - 1].to].includes((letter + (row + 1)) as Annotation),
              check: board.isCheck
                && board.getKing(board.currentPlayer).position === (letter + (row + 1)) as Annotation,
            })}
            key={letter + row}
          />
        ))
      ))}
      { [...Object.values(board.pieces)].map((piece) => (
        <PieceNode
          whiteView={whiteView}
          key={piece.id}
          piece={piece}
          isDraggable={board.currentPlayer === piece.color && !board.isCheckmate
              && (board[board.currentPlayer] as IUser)._id === user._id && [(board.white as IUser)._id, (board.black as IUser)._id].includes(user._id)}
          onMove={handleMove}
          setselectedPosition={setselectedPosition}
        />
      ))}
    </>

  )
}

export default BoardNode
