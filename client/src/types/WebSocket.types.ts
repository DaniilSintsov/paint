import { Figure } from '../services/tools/Tool/Tool.types'

export enum MessageMethods {
  connection = 'connection',
  sync = 'sync',
  draw = 'draw',
  actions = 'actions'
}

export enum MessageActionsMethodType {
  undo = 'undo',
  redo = 'redo',
  none = 'none'
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

export interface IMessageDataActions extends IMessageData {
  method: MessageMethods.actions
  action: MessageActionsMethodType
  undoList: string[]
  redoList: string[]
}

export interface IMessageDataSync extends IMessageData {
  method: MessageMethods.sync
  allUsers: string[]
  undoList: string[]
  redoList: string[]
}
