import { WebSocket } from 'ws'

export interface IExtWebSocket extends WebSocket {
  id: string
}

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw',
  actions = 'actions',
  sync = 'sync'
}

interface IMessageData {
  id: string
}

export interface IMessageDataConnection extends IMessageData {
  method: MessageMethods.connection
}

export interface IMessageDataDraw extends IMessageData {
  method: MessageMethods.draw
}

export interface IMessageDataActions extends IMessageData {
  method: MessageMethods.actions
}

export interface IMessageDataSync extends IMessageData {
  method: MessageMethods.sync
}
