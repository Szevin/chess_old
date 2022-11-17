/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import React from 'react'
import { Rnd } from 'react-rnd'
import { ColorTypes, PieceTypes, Piece, Annotation } from 'chess-common'
import { QuestionIcon } from '@chakra-ui/icons'
import BishopSvg from '../assets/pieces/BishopSvg'
import KingSvg from '../assets/pieces/KingSvg'
import KnightSvg from '../assets/pieces/KnightSvg'
import PawnSvg from '../assets/pieces/PawnSvg'
import QueenSvg from '../assets/pieces/QueenSvg'
import RookSvg from '../assets/pieces/RookSvg'

const annotationToCoord = (ann: Annotation) => ({
  x: 'abcdefgh'.indexOf(ann[0]) + 1,
  y: Number(ann[1]),
})

const PieceNode = ({ piece, setselectedPosition, onMove, isDraggable, whiteView }: {
  piece: Piece, setselectedPosition: (pos: Annotation) => void, onMove: (to: Annotation) => void, isDraggable: boolean, whiteView: boolean }) => (
    <Rnd
      className="piece flex justify-center items-center"
      enableResizing={false}
      bounds=".board"
      disableDragging={!isDraggable}
      enableUserSelectHack={false}
      onDragStart={() => setselectedPosition(piece.position)}
      onDragStop={(e, d) => onMove(
        `${(whiteView ? 'abcdefgh' : 'ghfedcba')[(Math.floor(d.x / 60))]}${(whiteView ? Math.floor(8 - ((d.y + 16) / 60)) : 7 - Math.floor(8 - (d.y + 16) / 60)) + 1}` as Annotation,
      )}
      size={{ width: 50, height: 50 }}
      position={{ x: ((whiteView ? annotationToCoord(piece.position).x : 9 - annotationToCoord(piece.position).x) * 64) - 50,
        y: ((whiteView ? annotationToCoord(piece.position).y : 9 - annotationToCoord(piece.position).y) * -64) + 525 }}
    >
      {getRender(piece)}
    </Rnd>
)

export const getRender = (piece: Piece) => {
  const { hidden, renderName, color } = piece
  if (hidden) return <QuestionIcon />

  switch (renderName) {
    case 'rook':
      return RookSvg({ color })
    case 'knight':
      return KnightSvg({ color })
    case 'bishop':
      return BishopSvg({ color })
    case 'queen':
      return QueenSvg({ color })
    case 'king':
      return KingSvg({ color })
    case 'pawn':
    default:
      return PawnSvg({ color })
  }
}

export default PieceNode
