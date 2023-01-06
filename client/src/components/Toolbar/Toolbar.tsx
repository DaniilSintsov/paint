import React, { useCallback, useEffect } from 'react'
import BarContainer from '../BarContainer/BarContainer'
import Brush from '../../services/tools/Brush/Brush'
import BarButton from '../BarButton/BarButton'
import toolState from '../../store/toolState/toolState'
import brushImg from '../../assets/img/tools/brush.png'
import circleImg from '../../assets/img/tools/circle.png'
import eraserImg from '../../assets/img/tools/eraser.png'
import lineImg from '../../assets/img/tools/line.png'
import rectImg from '../../assets/img/tools/rect.png'
import undoImg from '../../assets/img/manage/undo.png'
import redoImg from '../../assets/img/manage/redo.png'
import saveImg from '../../assets/img/manage/save.png'
import canvasState from '../../store/canvasState/canvasState'
import { ITool } from '../../services/tools/Tool/Tool'
import Rect from '../../services/tools/Rect/Rect'
import Circle from '../../services/tools/Circle/Circle'
import Eraser from '../../services/tools/Eraser/Eraser'
import Line from '../../services/tools/Line/Line'
import { Tools } from '../../services/tools/Tool/Tool.types'
import { DefaultValues } from '../../types/DefaultValues.types'
import { Storage } from '../../services/Storage/Storage.service'
import { StorageKeys } from '../../services/Storage/Storage.types'
import {
  IMessageDataActions,
  MessageActionsMethodType,
  MessageMethods
} from '../../types/WebSocket.types'
import connectionState from '../../store/connectionState/connectionState'

const Toolbar = () => {
  type Constructable<T = any> = new (...args: any[]) => T

  const barButtonHandler = useCallback(
    <T extends ITool>(Tool: Constructable<T>): void => {
      if (canvasState.canvas) {
        const newTool: ITool = new Tool(
          canvasState.canvas,
          connectionState.socket,
          connectionState.sessionId
        )
        toolState.setTool(newTool)
        toolState.setFillStyle(
          Storage.get(StorageKeys.fillColor) || DefaultValues.colorBlack
        )
        toolState.setLineWidth(
          Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
        )
        if (newTool.name === Tools.eraser) {
          toolState.setStrokeStyle(DefaultValues.colorWhite)
        } else {
          toolState.setStrokeStyle(
            Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
          )
        }
      }
    },
    []
  )

  const undoAndRedoActionsHandler = (
    action: MessageActionsMethodType
  ): void => {
    const data: IMessageDataActions = {
      method: MessageMethods.actions,
      sessionId: connectionState.sessionId as string,
      userId: connectionState.userId,
      action: action,
      undoList: canvasState.undoList,
      redoList: canvasState.redoList
    }
    connectionState.socket?.send(JSON.stringify(data))
  }

  const downloadHandler = () => {
    const dataUrl: string = canvasState.canvas?.toDataURL() as string
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = connectionState.sessionId + '.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    barButtonHandler(Brush)
  }, [barButtonHandler])

  return (
    <BarContainer>
      <div className="flex gap-[var(--bar-indent)]">
        <BarButton
          tipAlign="left"
          onClick={() => barButtonHandler(Brush)}
          image={brushImg}
          description="Кисть"
        />
        <BarButton
          tipAlign="left"
          onClick={() => barButtonHandler(Rect)}
          image={rectImg}
          description="Прямоугольник"
        />
        <BarButton
          tipAlign="left"
          onClick={() => barButtonHandler(Circle)}
          image={circleImg}
          description="Круг"
        />
        <BarButton
          tipAlign="left"
          onClick={() => barButtonHandler(Eraser)}
          image={eraserImg}
          description="Ластик"
        />
        <BarButton
          tipAlign="left"
          onClick={() => barButtonHandler(Line)}
          image={lineImg}
          description="Линия"
        />
      </div>
      <div className="flex gap-x-[var(--bar-indent)]">
        <BarButton
          tipAlign="right"
          onClick={() =>
            undoAndRedoActionsHandler(MessageActionsMethodType.undo)
          }
          image={undoImg}
          description="Назад"
        />
        <BarButton
          tipAlign="right"
          onClick={() =>
            undoAndRedoActionsHandler(MessageActionsMethodType.redo)
          }
          image={redoImg}
          description="Вперед"
        />
        <BarButton
          tipAlign="right"
          onClick={downloadHandler}
          image={saveImg}
          description="Сохранить"
        />
      </div>
    </BarContainer>
  )
}

export default Toolbar
