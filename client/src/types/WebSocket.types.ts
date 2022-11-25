import {Figure} from '../services/tools/Tool/Tool.types'

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw'
}

interface IMessageData {
  id: string
  username: string
}

export interface IMessageDataConnection extends IMessageData {
  method: MessageMethods.connection
}

export interface IMessageDataDraw extends IMessageData {
  method: MessageMethods.draw
  figure: Figure
}
