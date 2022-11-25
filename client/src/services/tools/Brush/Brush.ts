import Tool, {ITool} from '../Tool/Tool'
import {Tools} from '../Tool/Tool.types'
import {MessageMethods} from '../../../types/WebSocket.types'
import {DefaultValues} from '../../../types/DefaultValues.types'
import {Storage} from '../../Storage/Storage.service'
import {StorageKeys} from '../../Storage/Storage.types'

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
    this.socket?.send(
      JSON.stringify({
        method: MessageMethods.draw,
        id: this.id,
        figure: {
          type: Tools.none
        }
      })
    )
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
    this.socket?.send(
      JSON.stringify({
        method: MessageMethods.draw,
        id: this.id,
        figure: {
          type: Tools.none
        }
      })
    )
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
      this.socket?.send(
        JSON.stringify({
          method: MessageMethods.draw,
          id: this.id,
          figure: {
            type: Tools.brush,
            x: e.pageX - this.canvas.getBoundingClientRect().left,
            y: e.pageY - this.canvas.getBoundingClientRect().top,
            color: this.ctx?.strokeStyle,
            lineWidth: this.ctx?.lineWidth
          }
        })
      )
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
