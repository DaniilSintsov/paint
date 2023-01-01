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
  coords: [number, number][]
}

export class BrushParent extends Tool implements IBrush {
  coords: [number, number][] = []

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true
    if (this.ctx?.strokeStyle) {
      if (this.name === Tools.eraser)
        this.ctx.strokeStyle = DefaultValues.colorWhite
      else if (this.name === Tools.brush)
        this.ctx.strokeStyle =
          Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
    }
    this.ctx?.moveTo(
      e.pageX - this.canvas.getBoundingClientRect().left,
      e.pageY - this.canvas.getBoundingClientRect().top
    )
    const clearPathData: IMessageDataDraw = {
      method: MessageMethods.draw,
      id: this.id as string,
      figure: {
        type: Tools.none
      }
    }
    this.socket?.send(JSON.stringify(clearPathData))
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      const x: number = e.pageX - this.canvas.getBoundingClientRect().left
      const y: number = e.pageY - this.canvas.getBoundingClientRect().top
      this.coords.push([x, y])
      this.draw(x, y)
    }
  }

  draw(x: number, y: number): void {
    this.ctx?.lineTo(x, y)
    this.ctx?.stroke()
  }
}

export default class Brush extends BrushParent implements IBrush {
  name: string = Tools.brush

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
        type: Tools.brush,
        coords: this.coords,
        color: this.ctx?.strokeStyle as string,
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
    color: string,
    lineWidth: number
  ): void {
    ctx.strokeStyle = color
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
