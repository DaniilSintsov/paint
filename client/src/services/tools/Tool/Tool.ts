export interface ITool {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  destroyEvents: () => void
  listen: () => void
  mouseUpHandler: (e: MouseEvent) => void
  mouseDownHandler: (e: MouseEvent) => void
  mouseMoveHandler: (e: MouseEvent) => void
  fillStyle: string
  strokeStyle: string
  lineWidth: number
  name: string | undefined
}

export default class Tool implements ITool {
  name: string | undefined
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.destroyEvents()
  }

  set fillStyle(color: string) {
    if (this.ctx) {
      this.ctx.fillStyle = color
    }
  }

  set strokeStyle(color: string) {
    if (this.ctx) {
      this.ctx.strokeStyle = color
    }
  }

  set lineWidth(width: number) {
    if (this.ctx) {
      this.ctx.lineWidth = width
    }
  }

  listen(): void {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }

  destroyEvents(): void {
    this.canvas.onmouseup = null
    this.canvas.onmousedown = null
    this.canvas.onmousemove = null
  }

  mouseDownHandler(e: MouseEvent): void {
  }

  mouseMoveHandler(e: MouseEvent): void {
  }

  mouseUpHandler(e: MouseEvent): void {
  }
}
