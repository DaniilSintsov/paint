import connectionState from '../../../store/connectionState/connectionState'
import { DefaultValues } from '../../../types/DefaultValues.types'
import {
  IMessageDataDraw,
  MessageMethods
} from '../../../types/WebSocket.types'
import { Storage } from '../../Storage/Storage.service'
import { StorageKeys } from '../../Storage/Storage.types'
import Tool, { ITool } from '../Tool/Tool'
import { Tools } from '../Tool/Tool.types'

interface ILine extends ITool {
  draw: (x: number, y: number) => void
  saved: string | undefined
  startX: number | undefined
  startY: number | undefined
}

export default class Line extends Tool implements ILine {
  name: string = Tools.line
  startX: number | undefined
  startY: number | undefined
  saved: string | undefined

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    this.ctx?.beginPath()
    this.startX = e.pageX - this.canvas.getBoundingClientRect().left
    this.startY = e.pageY - this.canvas.getBoundingClientRect().top
    this.ctx?.moveTo(this.startX, this.startY)
    this.saved = this.canvas.toDataURL()

    const clearPathData: IMessageDataDraw = {
      method: MessageMethods.draw,
      sessionId: this.id as string,
      userId: connectionState.userId,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(clearPathData))
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
    const drawData: IMessageDataDraw = {
      method: MessageMethods.draw,
      sessionId: this.id as string,
      userId: connectionState.userId,
      figure: {
        type: Tools.line,
        x1: this.startX as number,
        y1: this.startY as number,
        x2: e.pageX - this.canvas.getBoundingClientRect().left,
        y2: e.pageY - this.canvas.getBoundingClientRect().top,
        color: this.ctx?.strokeStyle as string,
        lineWidth: this.ctx?.lineWidth as number
      }
    }
    this.socket?.send(JSON.stringify(drawData))

    const clearPathData: IMessageDataDraw = {
      method: MessageMethods.draw,
      sessionId: this.id as string,
      userId: connectionState.userId,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(clearPathData))
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      this.draw(
        e.pageX - this.canvas.getBoundingClientRect().left,
        e.pageY - this.canvas.getBoundingClientRect().top
      )
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
        if (this.startX && this.startY)
          this.ctx?.moveTo(this.startX, this.startY)
        this.ctx?.lineTo(x, y)
        this.ctx?.stroke()
      }
    }
  }

  static draw(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    lineWidth: number
  ): void {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx?.beginPath()
    ctx?.moveTo(x1, y1)
    ctx?.lineTo(x2, y2)
    ctx?.stroke()
    ctx.strokeStyle =
      Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    ctx.lineWidth =
      Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
  }
}
