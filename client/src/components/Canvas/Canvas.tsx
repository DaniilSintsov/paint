/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useRef, useState } from 'react'
import { jsx, css } from '@emotion/react'
import { observer } from 'mobx-react-lite'
import Brush from '../../services/tools/Brush/Brush'
import Rect from '../../services/tools/Rect/Rect'
import canvasState from '../../store/canvasState'
import toolState from '../../store/toolState'
import Modal from '../Modal/Modal'
import { useParams } from 'react-router-dom'
import {
  IMessageDataActions,
  IMessageDataConnection,
  IMessageDataDraw,
  MessageActionsMethodType,
  MessageMethods
} from '../../types/WebSocket.types'
import { Tools } from '../../services/tools/Tool/Tool.types'
import Eraser from '../../services/tools/Eraser/Eraser'
import Line from '../../services/tools/Line/Line'
import Circle from '../../services/tools/Circle/Circle'

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modal, setModal] = useState<boolean>(true)
  const params = useParams()

  useEffect(() => {
    if (canvasRef.current) {
      canvasState.setCanvas(canvasRef.current)
    }
  }, [])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000')
    canvasState.setSocket(socket)
    socket.onopen = () => {
      if (params.id && canvasState.username && canvasRef.current) {
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))
        const postData: IMessageDataConnection = {
          id: params.id,
          username: canvasState.username,
          method: MessageMethods.connection
        }
        socket.send(JSON.stringify(postData))
      }
    }

    socket.onmessage = (msg: MessageEvent) => {
      const message:
        | IMessageDataConnection
        | IMessageDataDraw
        | IMessageDataActions = JSON.parse(msg.data)
      switch (message.method) {
        case MessageMethods.connection:
          console.log(`Пользователь ${message.username} присоединился`)
          break
        case MessageMethods.draw:
          drawHandler(message)
          break
        case MessageMethods.actions:
          canvasState.undoList = message.undoList
          canvasState.redoList = message.redoList
          switch (message.action) {
            case MessageActionsMethodType.undo:
              canvasState.undo()
              break
            case MessageActionsMethodType.redo:
              canvasState.redo()
              break
          }
          break
      }
    }
  })

  const drawHandler = (message: IMessageDataDraw) => {
    if (canvasRef.current) {
      const figure = message.figure
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        switch (figure.type) {
          case Tools.brush:
            Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
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
            Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
            break
          case Tools.none:
            ctx.beginPath()
            break
        }
      }
    }
  }

  const mouseDownHandler = (): void => {
    canvasRef.current && canvasState.pushToUndo(canvasRef.current.toDataURL())
    const data: IMessageDataActions = {
      id: canvasState.sessionId as string,
      method: MessageMethods.actions,
      action: MessageActionsMethodType.none,
      undoList: canvasState.undoList,
      redoList: canvasState.redoList
    }
    canvasState.socket?.send(JSON.stringify(data))
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
            background-color: white;
          `}
        />
      </div>
    </React.Fragment>
  )
})

export default Canvas
