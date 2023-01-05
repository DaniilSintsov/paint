import { Figure } from '../services/tools/Tool/Tool.types'

export enum MessageMethods {
  connection = 'connection',
  sync = 'sync',
  draw = 'draw',
  actions = 'actions',
  close = 'close'
}

export enum MessageActionsMethodType {
  undo = 'undo',
  redo = 'redo',
  none = 'none'
}

interface IMessageData {
  sessionId: string
  userId: string
}

export interface IMessageDataConnection extends IMessageData {
  method: MessageMethods.connection
}

export interface IMessageDataConnectionWithAllUsers
  extends IMessageDataConnection {
  allUsers: string[]
}

export interface IMessageDataDraw extends IMessageData {
  method: MessageMethods.draw
  figure: Figure
}

export interface IMessageDataCloseWithAllUsers extends IMessageData {
  method: MessageMethods.close
  allUsers: string[]
}

export interface IMessageDataActions extends IMessageData {
  method: MessageMethods.actions
  action: MessageActionsMethodType
  undoList: string[]
  redoList: string[]
}

export interface IMessageDataSync extends IMessageData {
  method: MessageMethods.sync
  undoList: string[]
  redoList: string[]
}
