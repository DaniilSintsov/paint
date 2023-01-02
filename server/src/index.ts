import {
  IExtWebSocket,
  IMessageDataActions,
  IMessageDataConnection,
  IMessageDataDraw,
  MessageMethods
} from './types/WebSocket.types.js'
import express, { Request } from 'express'
import expressWs from 'express-ws'
import { MessageEvent, WebSocket } from 'ws'

const appBase: express.Application = express()
const wsServer = expressWs(appBase)
const aWss = wsServer.getWss()
const { app } = wsServer

const PORT = process.env.PORT || 5000

app.ws('/', (ws: WebSocket, req: Request): void => {
  ws.onmessage = (msg: MessageEvent) => {
    const message:
      | IMessageDataConnection
      | IMessageDataDraw
      | IMessageDataActions = JSON.parse(msg.data as string)
    switch (message.method) {
      case MessageMethods.connection:
        connectionHandler(ws as IExtWebSocket, message)
        break
      case MessageMethods.draw:
        broadcastConnection(ws as IExtWebSocket, message)
      case MessageMethods.actions:
        broadcastConnection(ws as IExtWebSocket, message)
    }
  }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

function connectionHandler(
  ws: IExtWebSocket,
  message: IMessageDataConnection
): void {
  ws.id = message.id
  broadcastConnection(ws, message)
}

function broadcastConnection(
  ws: IExtWebSocket,
  message: IMessageDataConnection | IMessageDataDraw | IMessageDataActions
): void {
  aWss.clients.forEach(
    (client: WebSocket, _: WebSocket, set: Set<WebSocket>): void => {
      if ((client as IExtWebSocket).id === message.id)
        (client as IExtWebSocket).send(JSON.stringify(message))
    }
  )
}
