import Tool, {ITool} from '../Tool/Tool'
import {Tools} from '../Tool/Tool.types'

interface IRect extends ITool {
  draw: (x: number, y: number, w: number, h: number) => void
  mouseDown: boolean | undefined
  startX: number | undefined
  startY: number | undefined
  saved: string | undefined
}

export default class Rect extends Tool implements IRect {
  name: string = Tools.rect
  saved: string | undefined
  startX: number | undefined
  startY: number | undefined
  mouseDown: boolean | undefined

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.listen()
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    this.ctx?.beginPath()
    this.startX = e.pageX - this.canvas.getBoundingClientRect().left
    this.startY = e.pageY - this.canvas.getBoundingClientRect().top
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      const currentX: number = e.pageX - this.canvas.getBoundingClientRect().left
      const currentY: number = e.pageY - this.canvas.getBoundingClientRect().top
      if (this.startX && this.startY) {
        const width: number = currentX - this.startX
        const height: number = currentY - this.startY
        this.draw(this.startX, this.startY, width, height)
      }
    }
  }

  draw(x: number, y: number, w: number, h: number): void {
    const img: CanvasImageSource = new Image()
    if (this.saved) {
      img.src = this.saved
      img.onload = () => {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.beginPath()
        this.ctx?.rect(x, y, w, h)
        this.ctx?.fill()
        this.ctx?.stroke()
      }
    }
  }
}
