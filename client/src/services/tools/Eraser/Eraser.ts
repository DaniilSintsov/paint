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

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false
    const drawData: IMessageDataDraw = {
      method: MessageMethods.draw,
      id: this.id as string,
      figure: {
        type: Tools.eraser,
        coords: this.coords,
        lineWidth: this.ctx?.lineWidth as number
      }
    }
    this.socket?.send(JSON.stringify(drawData))
    this.coords = []

    const clearPathData: IMessageDataDraw = {
      method: MessageMethods.draw,
      id: this.id as string,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(clearPathData))
  }

  static draw(
    ctx: CanvasRenderingContext2D,
    coords: [number, number][],
    lineWidth: number
  ): void {
    ctx.strokeStyle = DefaultValues.colorWhite
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    coords.forEach(coord => {
      ctx?.lineTo(coord[0], coord[1])
    })
    ctx?.stroke()
    ctx.strokeStyle =
      Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    ctx.lineWidth =
      Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
  }
}
