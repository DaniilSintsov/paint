import Brush from '../Brush/Brush'
import {Tools} from '../Tool/Tool.types'

export default class Eraser extends Brush {
  name: string = Tools.eraser

  draw(x: number, y: number): void {
    this.ctx?.lineTo(x, y)
    this.ctx?.stroke()
  }
}
