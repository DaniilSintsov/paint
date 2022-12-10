import Tool, { ITool } from '../Tool/Tool'
import { Tools } from '../Tool/Tool.types'
import { DefaultValues } from '../../../types/DefaultValues.types'
import { MessageMethods } from '../../../types/WebSocket.types'
import { Storage } from '../../Storage/Storage.service'
import { StorageKeys } from '../../Storage/Storage.types'

interface IRect extends ITool {
  draw: (x: number, y: number, w: number, h: number) => void
  mouseDown: boolean | undefined
  startX: number | undefined
  startY: number | undefined
  saved: string | undefined
  width: number | undefined
  height: number | undefined
}

export default class Rect extends Tool implements IRect {
  name: string = Tools.rect
  saved: string | undefined
  startX: number | undefined
  startY: number | undefined
  mouseDown: boolean | undefined
  width: number | undefined
  height: number | undefined

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
          type: Tools.rect,
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
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
        this.width = currentX - this.startX
        this.height = currentY - this.startY
        this.draw(this.startX, this.startY, this.width, this.height)
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

  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    strokeColor: string,
    fillColor: string,
    strokeWidth: number
  ): void {
    ctx.fillStyle = fillColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx?.beginPath()
    ctx?.rect(x, y, w, h)
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
