/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react'
import {jsx, css} from '@emotion/react'
import {observer} from 'mobx-react-lite'
import {useEffect, useRef} from 'react'
import Brush from '../../services/tools/Brush/Brush'
import canvasState from '../../store/canvasState'
import toolState from '../../store/toolState'

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      canvasState.setCanvas(canvasRef.current)
      toolState.setTool(new Brush(canvasRef.current))
    }
  }, [])

  const mouseDownHandler = (): void => {
    if (canvasRef.current) {
      canvasState.pushToUndo(canvasRef.current.toDataURL())
    }
  }

  return (
    <div className="p-[var(--bar-indent)] overflow-auto">
      <canvas
        width={800}
        height={600}
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        css={css`
          margin: 0 auto;
          border: var(--border-weight) solid black;
          background-color: white;
        `}></canvas>
    </div>
  )
})

export default Canvas
