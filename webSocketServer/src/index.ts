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
import cors from 'express';
import { MessageEvent, WebSocket } from 'ws';
import { PORT } from './utils/constants/launch.constants.js';
import { getAllUsers } from './utils/helpers/getAllUsers.helpers.js';

const appBase: express.Application = express();
const wsServer = expressWs(appBase);
const aWss = wsServer.getWss();
const { app } = wsServer;

app.use(cors());

app.ws('/api', (ws: WebSocket): void => {
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
      allUsers: getAllUsers(aWss.clients as Set<IExtWebSocket>, message).filter(
        user => user !== message.userId
      )
    };
    broadcast(messageWithAllUsers);
  };
});

app.listen(PORT, () =>
  console.log(`WebSocket server has been started on port ${PORT}...`)
);

function connectionHandler(message: IMessageDataConnection): void {
  const messageWithAllUsers: IMessageDataConnectionWithAllUsers = {
    ...message,
    allUsers: getAllUsers(aWss.clients as Set<IExtWebSocket>, message)
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
