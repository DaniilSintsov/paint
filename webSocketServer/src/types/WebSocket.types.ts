import { WebSocket } from 'ws';

export interface IExtWebSocket extends WebSocket {
  sessionId: string;
  userId: string;
}

export enum MessageMethods {
  connection = 'connection',
  draw = 'draw',
  actions = 'actions',
  sync = 'sync',
  close = 'close'
}

interface IMessageData {
  sessionId: string;
  userId: string;
}

export interface IMessageDataConnection extends IMessageData {
  method: MessageMethods.connection;
}

export interface IMessageDataConnectionWithAllUsers
  extends IMessageDataConnection {
  allUsers: string[];
}

export interface IMessageDataClose extends IMessageData {
  method: MessageMethods.close;
}

export interface IMessageDataCloseWithAllUsers extends IMessageDataClose {
  allUsers: string[];
}

export interface IMessageDataDraw extends IMessageData {
  method: MessageMethods.draw;
}

export interface IMessageDataActions extends IMessageData {
  method: MessageMethods.actions;
}

export interface IMessageDataSync extends IMessageData {
  method: MessageMethods.sync;
}
