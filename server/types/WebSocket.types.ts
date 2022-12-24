export interface IExtWebSocket extends WebSocket {
  id: string
}

export enum Tools {
  brush = 'brush',
  rect = 'rect',
  circle = 'circle',
  eraser = 'eraser',
  line = 'line',
  none = 'none'
}

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw'
}

export type Figure =
  | IFigureNone
  | IFigureBrush
  | IFigureRect
  | IFigureEraser
  | IFigureLine
  | IFigureCircle

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
  strokeWidth: number
}

interface IFigureLine {
  type: Tools.line
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  lineWidth: number
}

interface IFigureCircle {
  type: Tools.circle
  x: number
  y: number
  radius: number
  fillColor: string
  strokeColor: string
  strokeWidth: number
}

interface IMessageData {
  id: string
}

export interface IMessageDataConnection extends IMessageData {
  method: MessageMethods.connection
  username: string
}

export interface IMessageDataDraw extends IMessageData {
  method: MessageMethods.draw
  figure: Figure
}
