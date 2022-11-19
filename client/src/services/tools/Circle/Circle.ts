import Tool, {ITool} from '../Tool/Tool'
import {Tools} from '../Tool/Tool.types'

interface ICircle extends ITool {
  draw: (x: number, y: number, radius: number) => void
  mouseDown: boolean | undefined
  startX: number | undefined
  startY: number | undefined
  saved: string | undefined
}

export default class Circle extends Tool implements ICircle {
  name: string = Tools.circle
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
        const radius: number = Math.sqrt(width ** 2 + height ** 2)
        this.draw(this.startX, this.startY, radius)
      }
    }
  }

  draw(x: number, y: number, radius: number): void {
    const img: CanvasImageSource = new Image()
    if (this.saved) {
      img.src = this.saved
      img.onload = () => {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx?.beginPath()
        this.ctx?.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.ctx?.fill()
        this.ctx?.stroke()
      }
    }
  }
}
