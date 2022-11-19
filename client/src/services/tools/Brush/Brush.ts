import Tool, {ITool} from '../Tool/Tool'
import {Tools} from '../Tool/Tool.types'

interface IBrush extends ITool {
  draw: (x: number, y: number) => void
  mouseDown: boolean | undefined
}

export default class Brush extends Tool implements IBrush {
  mouseDown: boolean | undefined
  name: string = Tools.brush

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.listen()
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    this.ctx?.beginPath()
    this.ctx?.moveTo(e.pageX - this.canvas.getBoundingClientRect().left, e.pageY - this.canvas.getBoundingClientRect().top)
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      this.draw(e.pageX - this.canvas.getBoundingClientRect().left, e.pageY - this.canvas.getBoundingClientRect().top)
    }
  }

  draw(x: number, y: number): void {
    this.ctx?.lineTo(x, y)
    this.ctx?.stroke()
  }
}
