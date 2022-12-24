import Tool, { ITool } from '../Tool/Tool'
import { Tools } from '../Tool/Tool.types'
import {
  IMessageDataDraw,
  MessageMethods
} from '../../../types/WebSocket.types'
import { DefaultValues } from '../../../types/DefaultValues.types'
import { Storage } from '../../Storage/Storage.service'
import { StorageKeys } from '../../Storage/Storage.types'

interface IBrush extends ITool {
  mouseDown: boolean | undefined
}

export class BrushParent extends Tool implements IBrush {
  mouseDown: boolean | undefined

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    this.ctx?.moveTo(
      e.pageX - this.canvas.getBoundingClientRect().left,
      e.pageY - this.canvas.getBoundingClientRect().top
    )
    const data: IMessageDataDraw = {
      method: MessageMethods.draw,
      id: this.id as string,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(data))
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
    const data: IMessageDataDraw = {
      method: MessageMethods.draw,
      id: this.id as string,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(data))
  }
}

export default class Brush extends BrushParent implements IBrush {
  name: string = Tools.brush

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      const data: IMessageDataDraw = {
        method: MessageMethods.draw,
        id: this.id as string,
        figure: {
          type: Tools.brush,
          x: e.pageX - this.canvas.getBoundingClientRect().left,
          y: e.pageY - this.canvas.getBoundingClientRect().top,
          color: this.ctx?.strokeStyle as string,
          lineWidth: this.ctx?.lineWidth as number
        }
      }
      this.socket?.send(JSON.stringify(data))
    }
  }

  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    lineWidth: number
  ): void {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx?.lineTo(x, y)
    ctx?.stroke()
    ctx.strokeStyle =
      Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    ctx.lineWidth =
      Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
  }
}
