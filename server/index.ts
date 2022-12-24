import {
  IExtWebSocket,
  IMessageDataActions,
  IMessageDataConnection,
  IMessageDataDraw,
  MessageMethods
} from './types/WebSocket.types'

const express = require('express')
const app = express()
const wsServer = require('express-ws')(app)
const aWss = wsServer.getWss()

const PORT = process.env.PORT || 5000

app.ws('/', (ws: IExtWebSocket, req: Request): void => {
  ws.onmessage = (msg: MessageEvent) => {
    const message:
      | IMessageDataConnection
      | IMessageDataDraw
      | IMessageDataActions = JSON.parse(msg.data)
    switch (message.method) {
      case MessageMethods.connection:
        connectionHandler(ws, message)
        break
      case MessageMethods.draw:
        broadcastConnection(ws, message)
      case MessageMethods.actions:
        broadcastConnection(ws, message)
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
    (
      client: IExtWebSocket,
      _: IExtWebSocket,
      set: Set<IExtWebSocket>
    ): void => {
      if (client.id === message.id) {
        client.send(JSON.stringify(message))
      }
    }
  )
}
