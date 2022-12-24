import { Figure } from '../services/tools/Tool/Tool.types'

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw'
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
