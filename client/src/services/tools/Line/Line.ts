import Tool, {ITool} from '../Tool/Tool'
import {Tools} from '../Tool/Tool.types'

interface ILine extends ITool {
  draw: (x: number, y: number) => void
  mouseDown: boolean | undefined
  saved: string | undefined
  currentX: number | undefined
  currentY: number | undefined
}

export default class Line extends Tool implements ILine {
  name: string = Tools.line
  currentX: number | undefined
  currentY: number | undefined
  saved: string | undefined
  mouseDown: boolean | undefined

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.listen()
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    this.ctx?.beginPath()
    this.currentX = e.pageX - this.canvas.getBoundingClientRect().left
    this.currentY = e.pageY - this.canvas.getBoundingClientRect().top
    this.ctx?.moveTo(this.currentX, this.currentY)
    this.saved = this.canvas.toDataURL()
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
    const img: CanvasImageSource = new Image()
    if (this.saved) {
      img.src = this.saved
      img.onload = () => {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.beginPath()
        if (this.currentX && this.currentY) {
          this.ctx?.moveTo(this.currentX, this.currentY)
        }
        this.ctx?.lineTo(x, y)
        this.ctx?.stroke()
      }
    }
  }
}
