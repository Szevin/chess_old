/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import React from 'react'
import { Rnd } from 'react-rnd'
import throttle from 'throttleit'
import Piece, { getRender } from '../models/Piece'
import { Annotation } from '../models/Position'

const annotationToCoord = (ann: Annotation) => ({
  x: 'abcdefgh'.indexOf(ann[0]) + 1,
  y: Number(ann[1]),
})

const PieceNode = ({ piece, setselectedPosition, onMove, isDraggable }: {
  piece: Piece, setselectedPosition: (pos: Annotation) => void, onMove: (to: Annotation) => void, isDraggable: boolean }) => {
  // TODO fix resize event
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)
  window.onresize = throttle(() => {
    forceUpdate()
  }, 100)

  return (
    <Rnd
      className="piece"
      enableResizing={false}
      bounds=".board"
      disableDragging={!isDraggable}
      enableUserSelectHack={false}
      onDragStart={() => setselectedPosition(piece.position)}
      onDragStop={(e, d) => onMove(`${'abcdefgh'[(Math.floor(d.x / 60))]}${Math.floor(8 - ((d.y + 16) / 60)) + 1}` as Annotation)}
      size={{ width: 50, height: 50 }}
      position={{ x: (annotationToCoord(piece.position).x * 64) - 50,
        y: (annotationToCoord(piece.position).y * -64) + 525 }}
    >
      <span style={{ fontSize: piece.color === 'white' || piece.name !== 'pawn' ? '3.5rem' : '2.5rem' }}>
        {getRender(piece.name, piece.color)}
      </span>
    </Rnd>
  )
}

export default PieceNode
