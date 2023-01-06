/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useRef, useState } from 'react'
import { jsx, css } from '@emotion/react'
import { observer } from 'mobx-react-lite'
import Brush from '../../services/tools/Brush/Brush'
import Rect from '../../services/tools/Rect/Rect'
import canvasState from '../../store/canvasState/canvasState'
import toolState from '../../store/toolState/toolState'
import Modal from '../Modal/Modal'
import { useParams } from 'react-router-dom'
import {
  IMessageDataActions,
  IMessageDataCloseWithAllUsers,
  IMessageDataConnection,
  IMessageDataConnectionWithAllUsers,
  IMessageDataDraw,
  IMessageDataSync,
  MessageActionsMethodType,
  MessageMethods
} from '../../types/WebSocket.types'
import { Tools } from '../../services/tools/Tool/Tool.types'
import Eraser from '../../services/tools/Eraser/Eraser'
import Line from '../../services/tools/Line/Line'
import Circle from '../../services/tools/Circle/Circle'
import connectionState from '../../store/connectionState/connectionState'
import { drawImageOnCanvas } from '../../utils/helpers/drawImageOnCanvas.helper'
import { DEVELOPMENT_WS_SERVER_PORT } from '../../utils/constants/launch.constants'

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modal, setModal] = useState<boolean>(true)
  const params = useParams()

  useEffect(() => {
    canvasRef.current && canvasState.setCanvas(canvasRef.current)
  }, [])

  const processWebSocketConnection = (): void => {
    const socket = new WebSocket(
      process.env.REACT_APP_WS_SERVER_ADDRESS ??
        `ws://localhost${DEVELOPMENT_WS_SERVER_PORT}/api`
    )
    connectionState.setSocket(socket)
    onOpenWebSocketHandler(socket)
    onMessageWebSocketHandler(socket)
  }

  const onOpenWebSocketHandler = (socket: WebSocket): void => {
    socket.onopen = () => {
      if (params.id && connectionState.userId && canvasState.canvas) {
        connectionState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasState.canvas, socket, params.id))
        const postData: IMessageDataConnection = {
          sessionId: params.id,
          userId: connectionState.userId,
          method: MessageMethods.connection
        }
        socket.send(JSON.stringify(postData))
      }
    }
  }

  const onMessageWebSocketHandler = (socket: WebSocket): void => {
    socket.onmessage = (msg: MessageEvent) => {
      const message:
        | IMessageDataConnectionWithAllUsers
        | IMessageDataSync
        | IMessageDataCloseWithAllUsers
        | IMessageDataDraw
        | IMessageDataActions = JSON.parse(msg.data)
      switch (message.method) {
        case MessageMethods.connection:
          connectionHandler(message)
          break
        case MessageMethods.sync:
          syncHandler(message)
          break
        case MessageMethods.draw:
          drawHandler(message)
          break
        case MessageMethods.actions:
          actionsHandler(message)
          break
        case MessageMethods.close:
          closeHandler(message)
          break
      }
    }
  }

  const connectionHandler = (message: IMessageDataConnectionWithAllUsers) => {
    message.allUsers.length && connectionState.setAllUsers(message.allUsers)
    if (canvasState.undoList.length) {
      canvasState.canvas &&
        canvasState.pushToUndo(canvasState.canvas.toDataURL())
      const syncData: IMessageDataSync = {
        method: MessageMethods.sync,
        sessionId: connectionState.sessionId as string,
        userId: connectionState.userId,
        undoList: canvasState.undoList,
        redoList: canvasState.redoList
      }
      connectionState.socket?.send(JSON.stringify(syncData))
    }
  }

  const closeHandler = (message: IMessageDataCloseWithAllUsers) => {
    message.allUsers.length && connectionState.setAllUsers(message.allUsers)
  }

  const syncHandler = (message: IMessageDataSync) => {
    if (
      canvasState.undoList !== message.undoList ||
      canvasState.redoList !== message.redoList
    ) {
      canvasState.setUndoList(message.undoList)
      canvasState.setRedoList(message.redoList)
      if (canvasState.canvas && canvasState.undoList.length)
        drawImageOnCanvas(
          canvasState.canvas,
          canvasState.undoList.pop() as string
        )
    }
  }

  const drawHandler = (message: IMessageDataDraw) => {
    if (canvasState.canvas) {
      const figure = message.figure
      const ctx = canvasState.canvas.getContext('2d')
      if (ctx) {
        switch (figure.type) {
          case Tools.brush:
            Brush.draw(ctx, figure.coords, figure.color, figure.lineWidth)
            break
          case Tools.rect:
            Rect.draw(
              ctx,
              figure.x,
              figure.y,
              figure.width,
              figure.height,
              figure.strokeColor,
              figure.fillColor,
              figure.strokeWidth
            )
            break
          case Tools.line:
            Line.draw(
              ctx,
              figure.x1,
              figure.y1,
              figure.x2,
              figure.y2,
              figure.color,
              figure.lineWidth
            )
            break
          case Tools.circle:
            Circle.draw(
              ctx,
              figure.x,
              figure.y,
              figure.radius,
              figure.strokeColor,
              figure.fillColor,
              figure.strokeWidth
            )
            break
          case Tools.eraser:
            Eraser.draw(ctx, figure.coords, figure.lineWidth)
            break
          case Tools.none:
            ctx.beginPath()
            break
        }
      }
    }
  }

  const actionsHandler = (message: IMessageDataActions) => {
    canvasState.setUndoList(message.undoList)
    canvasState.setRedoList(message.redoList)
    switch (message.action) {
      case MessageActionsMethodType.undo:
        canvasState.undo()
        break
      case MessageActionsMethodType.redo:
        canvasState.redo()
        break
    }
  }

  useEffect(() => {
    processWebSocketConnection()
  })

  useEffect(() => {
    const closeWebSocketConnection = () => {
      connectionState.socket?.close()
    }

    const alertUser = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', alertUser)
    window.addEventListener('unload', closeWebSocketConnection)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
      window.removeEventListener('unload', closeWebSocketConnection)
    }
  })

  const mouseDownHandler = (): void => {
    canvasState.canvas && canvasState.pushToUndo(canvasState.canvas.toDataURL())
    const data: IMessageDataActions = {
      sessionId: connectionState.sessionId as string,
      userId: connectionState.userId,
      method: MessageMethods.actions,
      action: MessageActionsMethodType.none,
      undoList: canvasState.undoList,
      redoList: canvasState.redoList
    }
    connectionState.socket?.send(JSON.stringify(data))
  }

  return (
    <React.Fragment>
      <Modal
        show={modal}
        setShow={setModal}
      />
      <div className="p-[var(--bar-indent)] overflow-auto">
        <canvas
          width={2560}
          height={1440}
          onMouseDown={mouseDownHandler}
          ref={canvasRef}
          css={css`
            margin: 0 auto;
            border: var(--border-weight) solid var(--border-color);
            border-radius: var(--border-radius);
            background-color: white;
          `}
        />
      </div>
    </React.Fragment>
  )
})

export default Canvas
