export interface IExtWebSocket extends WebSocket {
  id: string
}

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw',
  actions = 'actions'
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
