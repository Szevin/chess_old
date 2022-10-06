export type Direction = 'up' | 'down' | 'left' | 'right'
// eslint-disable-next-line max-len
export type Annotation = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' | 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8'
export const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

class Position {
  annotation: Annotation

  x: number

  y: number

  constructor(ann: Annotation) {
    this.x = COLS.indexOf(ann[0]) +1
    this.y = Number(ann[1])
    this.annotation = ann
  }

  isValid() {
    return this.x >= 1 && this.x <= 8 && this.y >= 1 && this.y <= 8
  }

  addDirection(direction: Direction) {
    switch (direction) {
      case 'up':
        this.y += 1
        break
      case 'down':
        this.y -= 1
        break
      case 'left':
        this.x -= 1
        break
      case 'right':
        this.x += 1
        break
      default:
        break
    }
    this.annotation = `${COLS[this.x - 1]}${this.y}` as Annotation

    return this
  }

  addDirections(directions: Direction[]) {
    directions.forEach((direction) => {
      this.addDirection(direction)
    })

    return this
  }
}

export default Position
