import {
  IExtWebSocket,
  IMessageDataActions,
  IMessageDataClose,
  IMessageDataCloseWithAllUsers,
  IMessageDataConnection,
  IMessageDataConnectionWithAllUsers,
  IMessageDataDraw,
  IMessageDataSync,
  MessageMethods
} from './types/WebSocket.types.js';
import express from 'express';
import expressWs from 'express-ws';
import { MessageEvent, WebSocket } from 'ws';

const appBase: express.Application = express();
const wsServer = expressWs(appBase);
const aWss = wsServer.getWss();
const { app } = wsServer;

const PORT = process.env.PORT || 5000;

app.ws('/', (ws: WebSocket): void => {
  ws.onmessage = (msg: MessageEvent) => {
    const message:
      | IMessageDataConnection
      | IMessageDataSync
      | IMessageDataDraw
      | IMessageDataActions = JSON.parse(msg.data as string);
    (ws as IExtWebSocket).sessionId = message.sessionId;
    (ws as IExtWebSocket).userId = message.userId;
    switch (message.method) {
      case MessageMethods.connection:
        connectionHandler(message);
        break;
      case MessageMethods.sync:
        broadcast(message);
        break;
      case MessageMethods.draw:
        broadcast(message);
        break;
      case MessageMethods.actions:
        broadcast(message);
        break;
    }
  };

  ws.onclose = () => {
    const message: IMessageDataClose = {
      sessionId: (ws as IExtWebSocket).sessionId,
      userId: (ws as IExtWebSocket).userId,
      method: MessageMethods.close
    };
    const messageWithAllUsers: IMessageDataCloseWithAllUsers = {
      ...message,
      allUsers: getAllUsers(message).filter(user => user !== message.userId)
    };
    broadcast(messageWithAllUsers);
  };
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

function connectionHandler(message: IMessageDataConnection): void {
  const messageWithAllUsers: IMessageDataConnectionWithAllUsers = {
    ...message,
    allUsers: getAllUsers(message)
  };
  broadcast(messageWithAllUsers);
}

function broadcast(
  message:
    | IMessageDataConnectionWithAllUsers
    | IMessageDataClose
    | IMessageDataDraw
    | IMessageDataActions
    | IMessageDataSync
): void {
  Array.from(aWss.clients).forEach((client: WebSocket): void => {
    if ((client as IExtWebSocket).sessionId === message.sessionId) {
      client.send(JSON.stringify(message));
    }
  });
}

function getAllUsers(
  message:
    | IMessageDataConnection
    | IMessageDataClose
    | IMessageDataDraw
    | IMessageDataActions
    | IMessageDataSync
): string[] {
  return Array.from(aWss.clients)
    .filter(client => (client as IExtWebSocket).sessionId === message.sessionId)
    .map(client => (client as IExtWebSocket).userId);
}
