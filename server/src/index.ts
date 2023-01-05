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
} from './types/WebSocket.types.js'
import express from 'express'
import expressWs from 'express-ws'
import { MessageEvent, WebSocket } from 'ws'

const appBase: express.Application = express()
const wsServer = expressWs(appBase)
const aWss = wsServer.getWss()
const { app } = wsServer

const PORT = process.env.PORT || 5000

app.ws('/', (ws: WebSocket): void => {
  ws.onmessage = (msg: MessageEvent) => {
    const message:
      | IMessageDataConnection
      | IMessageDataSync
      | IMessageDataClose
      | IMessageDataDraw
      | IMessageDataActions = JSON.parse(msg.data as string)
    switch (message.method) {
      case MessageMethods.connection:
        connectionHandler(ws as IExtWebSocket, message)
        break
      case MessageMethods.sync:
        broadcast(message)
        break
      case MessageMethods.draw:
        broadcast(message)
        break
      case MessageMethods.actions:
        broadcast(message)
        break
      case MessageMethods.close:
        closeHandler(message)
    }
  }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

function connectionHandler(
  ws: IExtWebSocket,
  message: IMessageDataConnection
): void {
  ws.sessionId = message.sessionId
  ws.userId = message.userId
  const messageWithAllUsers: IMessageDataConnectionWithAllUsers = {
    ...message,
    allUsers: getAllUsers(message)
  }
  broadcast(messageWithAllUsers)
}

function closeHandler(message: IMessageDataClose): void {
  const messageWithAllUsers: IMessageDataCloseWithAllUsers = {
    ...message,
    allUsers: getAllUsers(message).filter(msg => msg !== message.userId)
  }
  broadcast(messageWithAllUsers)
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
      client.send(JSON.stringify(message))
    }
  })
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
    .map(client => (client as IExtWebSocket).userId)
}
