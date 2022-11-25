export enum Tools {
  brush = 'brush',
  rect = 'rect',
  circle = 'circle',
  eraser = 'eraser',
  line = 'line',
  none = 'none'
}

export type Figure = IFigureNone | IFigureBrush | IFigureRect | IFigureEraser

interface IFigureNone {
  type: Tools.none
}

interface IFigureBrush {
  type: Tools.brush
  x: number
  y: number
  color: string
  lineWidth: number
}

interface IFigureEraser {
  type: Tools.eraser
  x: number
  y: number
  lineWidth: number
}

interface IFigureRect {
  type: Tools.rect
  x: number
  y: number
  width: number
  height: number
  fillColor: string
  strokeColor: string
}
