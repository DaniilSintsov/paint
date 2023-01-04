import { makeAutoObservable } from 'mobx'

interface IConnectionState {
  username: string
  allUsers: string[]
  socket: WebSocket | null
  sessionId: string | null
  setUsername: (username: string) => void
  setAllUsers: (allUsers: string[]) => void
  addUser: (user: string) => void
  setSocket: (socket: WebSocket) => void
  setSessionId: (sessionId: string) => void
}

class ConnectionState implements IConnectionState {
  socket: WebSocket | null = null
  sessionId: string | null = null
  username: string = ''
  allUsers: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addUser(user: string): void {
    this.allUsers.push(user)
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

  setUsername(username: string) {
    this.username = username
  }
}

export default new ConnectionState()
