import { makeAutoObservable } from 'mobx'

interface IConnectionState {
  username: string
  socket: WebSocket | null
  sessionId: string | null
  setUsername: (username: string) => void
  setSocket: (socket: WebSocket) => void
  setSessionId: (sessionId: string) => void
}

class ConnectionState implements IConnectionState {
  socket: WebSocket | null = null
  sessionId: string | null = null
  username: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  setSocket(socket: WebSocket): void {
    this.socket = socket
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId
  }

  setUsername(username: string) {
    this.username = username
  }
}

export default new ConnectionState()
