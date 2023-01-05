import { makeAutoObservable } from 'mobx'
import { drawImageOnCanvas } from '../../utils/helpers/drawImageOnCanvas.helper'

interface ICanvasState {
  canvas: HTMLCanvasElement | null
  setCanvas: (canvas: HTMLCanvasElement) => void
  undoList: string[]
  redoList: string[]
  setUndoList: (undoList: string[]) => void
  setRedoList: (redoList: string[]) => void
  pushToUndo: (data: string) => void
  pushToRedo: (data: string) => void
  undo: () => void
  redo: () => void
}

class CanvasState implements ICanvasState {
  canvas: HTMLCanvasElement | null = null
  redoList: string[] = []
  undoList: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
  }

  setUndoList(undoList: string[]): void {
    this.undoList = undoList
  }

  setRedoList(redoList: string[]): void {
    this.redoList = redoList
  }

  pushToRedo(data: string): void {
    this.redoList.push(data)
  }

  pushToUndo(data: string): void {
    this.undoList.push(data)
  }

  undo(): void {
    const ctx = this.canvas?.getContext('2d')
    if (this.undoList.length > 0) {
      const dataUrl: string = this.undoList.pop() as string
      this.canvas && this.pushToRedo(this.canvas?.toDataURL())
      drawImageOnCanvas(this.canvas as HTMLCanvasElement, dataUrl)
    } else {
      if (this.canvas?.width && this.canvas.height) {
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }
  }

  redo(): void {
    if (this.redoList.length > 0) {
      const dataUrl: string = this.redoList.pop() as string
      this.canvas && this.pushToUndo(this.canvas.toDataURL())
      drawImageOnCanvas(this.canvas as HTMLCanvasElement, dataUrl)
    }
  }
}

export default new CanvasState()
