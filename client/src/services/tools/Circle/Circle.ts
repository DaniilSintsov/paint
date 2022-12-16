import { DefaultValues } from '../../../types/DefaultValues.types'
import { MessageMethods } from '../../../types/WebSocket.types'
import { Storage } from '../../Storage/Storage.service'
import { StorageKeys } from '../../Storage/Storage.types'
import Tool, { ITool } from '../Tool/Tool'
import { Tools } from '../Tool/Tool.types'

interface ICircle extends ITool {
  draw: (x: number, y: number, radius: number) => void
  mouseDown: boolean | undefined
  startX: number | undefined
  startY: number | undefined
  saved: string | undefined
  radius: number | undefined
}

export default class Circle extends Tool implements ICircle {
  name: string = Tools.circle
  saved: string | undefined
  startX: number | undefined
  startY: number | undefined
  mouseDown: boolean | undefined
  radius: number | undefined

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
    this.socket?.send(
      JSON.stringify({
        method: MessageMethods.draw,
        id: this.id,
        figure: {
          type: Tools.circle,
          x: this.startX,
          y: this.startY,
          radius: this.radius,
          fillColor: this.ctx?.fillStyle,
          strokeColor: this.ctx?.strokeStyle,
          strokeWidth: this.ctx?.lineWidth
        }
      })
    )
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
      const currentX: number =
        e.pageX - this.canvas.getBoundingClientRect().left
      const currentY: number = e.pageY - this.canvas.getBoundingClientRect().top
      if (this.startX && this.startY) {
        const width: number = currentX - this.startX
        const height: number = currentY - this.startY
        this.radius = Math.sqrt(width ** 2 + height ** 2)
        this.draw(this.startX, this.startY, this.radius)
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

  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    strokeColor: string,
    fillColor: string,
    strokeWidth: number
  ): void {
    ctx.fillStyle = fillColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx?.beginPath()
    ctx?.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx?.fill()
    ctx?.stroke()
    ctx.fillStyle =
      Storage.get(StorageKeys.fillColor) || DefaultValues.colorBlack
    ctx.strokeStyle =
      Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    ctx.lineWidth =
      Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
  }
}
