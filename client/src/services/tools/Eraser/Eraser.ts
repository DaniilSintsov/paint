import { BrushParent } from '../Brush/Brush'
import { Tools } from '../Tool/Tool.types'
import { Storage } from '../../Storage/Storage.service'
import { StorageKeys } from '../../Storage/Storage.types'
import { DefaultValues } from '../../../types/DefaultValues.types'
import {
  IMessageDataDraw,
  MessageMethods
} from '../../../types/WebSocket.types'

export default class Eraser extends BrushParent {
  name: string = Tools.eraser

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
          type: Tools.eraser,
          x: e.pageX - this.canvas.getBoundingClientRect().left,
          y: e.pageY - this.canvas.getBoundingClientRect().top,
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
    lineWidth: number
  ): void {
    ctx.strokeStyle = DefaultValues.colorWhite
    ctx.lineWidth = lineWidth
    ctx?.lineTo(x, y)
    ctx?.stroke()
    ctx.strokeStyle =
      Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    ctx.lineWidth =
      Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
  }
}
