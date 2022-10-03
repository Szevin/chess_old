import './Board.css'

import classNames from 'classnames'
import React from 'react'
import { Annotation, Move } from 'chess-common'
import PieceNode from './PieceNode'
import { useAppSelector } from '../store'

// eslint-disable import/no-named-as-default
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
const BoardNode = ({ move }: { move: (movement: Move) => void }) => {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  const [selectedPosition, setselectedPosition] = React.useState<Annotation | null>(null)
  const [validMoves, setValidMoves] = React.useState<Array<Annotation>>([])

  const board = useAppSelector((state) => state.board)

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

    setValidMoves([...piece.moves, ...piece.captures])
  }, [selectedPosition])

  const handleMove = (to: Annotation) => {
    if (!selectedPosition) return
    const piece = board.getPiece(selectedPosition)
    if (!piece) {
      return
    }

    if (!([...piece.moves, ...piece.captures] ?? []).length || ![...piece.moves, ...piece.captures].includes(to)) {
      setselectedPosition(null)
      return
    }

    move({
      from: selectedPosition,
      to,
      piece: piece.name,
    })
    setselectedPosition(null)
  }

  return (
    <div className="container">
      <div className="row mt-4 p-0">
        <div className="col-1 p-0 mt-2">
          {Array(8).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="coord-number col-1">
              {8 - i}
            </div>
          ))}
        </div>
        <div className="col-auto p-0">

          <div className="board">
            {Array.from(Array(8).keys()).reverse().map((row) => (
              cols.map((letter, col) => (
                <div
                  className={classNames({
                    black: ((col % 2) && !(row % 2)) || (!(col % 2) && (row % 2)),
                    white: !(((col % 2) && !(row % 2)) || (!(col % 2) && (row % 2))),
                    valid: validMoves.includes((letter + (row + 1)) as Annotation),
                    // last: [board.getLastMove()?.to.annotation, board.getLastMove()?.from.annotation].includes((letter + (row + 1)) as Annotation),
                    check: board.isCheck
                    && board.getPiece(`${letter}${row + 1}` as Annotation)?.name === 'king',
                  })}
                  key={letter + row}
                />
              ))
            ))}
            { board.pieces.map((piece) => (
              <PieceNode
                key={piece.color + piece.name + piece.position}
                piece={piece}
                isDraggable={board.currentPlayer === piece.color && !board.isCheckmate}
                onMove={handleMove}
                setselectedPosition={setselectedPosition}
              />
            ))}
          </div>

          <div className="letter-coords ml-2">
            { cols.map((letter) => (<div key={letter} className="coord-letter">{letter}</div>)) }
          </div>
        </div>
        <div className="prev-moves col-2 p-0 m-0">
          { board.moves.map((move) => (
            // TODO unique keys
            <li key={move.piece + move.from + move.to}>
              {`${move.piece}${move.from}-${move.to}`}
            </li>
          )) }
        </div>
      </div>
    </div>
  )
}

export default BoardNode
