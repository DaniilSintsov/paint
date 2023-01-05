import { makeAutoObservable } from 'mobx'

interface IConnectionState {
  userId: string
  allUsers: string[]
  socket: WebSocket | null
  sessionId: string | null
  setUserId: (username: string) => void
  setAllUsers: (allUsers: string[]) => void
  setSocket: (socket: WebSocket) => void
  setSessionId: (sessionId: string) => void
}

class ConnectionState implements IConnectionState {
  socket: WebSocket | null = null
  sessionId: string | null = null
  userId: string = ''
  allUsers: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setAllUsers(allUsers: string[]): void {
    this.allUsers = allUsers
  }

  setSocket(socket: WebSocket): void {
    this.socket = socket
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId
  }

  setUserId(username: string) {
    this.userId = username
  }
}

export default new ConnectionState()
