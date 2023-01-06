import {
  IExtWebSocket,
  IMessageDataActions,
  IMessageDataClose,
  IMessageDataConnection,
  IMessageDataDraw,
  IMessageDataSync
} from '../../types/WebSocket.types.js';

export function getAllUsers(
  clients: Set<IExtWebSocket>,
  message:
    | IMessageDataConnection
    | IMessageDataClose
    | IMessageDataDraw
    | IMessageDataActions
    | IMessageDataSync
): string[] {
  return Array.from(clients)
    .filter(client => client.sessionId === message.sessionId)
    .map(client => client.userId);
}
