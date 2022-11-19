import {makeAutoObservable} from 'mobx'

interface ICanvasState {
  canvas: HTMLCanvasElement | null
  setCanvas: (canvas: HTMLCanvasElement) => void
  undoList: string[]
  redoList: string[]
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

  pushToRedo(data: string): void {
    this.redoList.push(data)
  }

  pushToUndo(data: string): void {
    this.undoList.push(data)
  }

  private drawImage(dataUrl: string): void {
    const ctx = this.canvas?.getContext('2d')
    const img: CanvasImageSource = new Image()
    img.src = dataUrl
    img.onload = () => {
      if (this.canvas?.width && this.canvas.height) {
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      }
    }
  }

  undo(): void {
    const ctx = this.canvas?.getContext('2d')
    if (this.undoList.length > 0) {
      const dataUrl: string = this.undoList.pop() as string
      if (this.canvas) {
        this.pushToRedo(this.canvas?.toDataURL())
      }
      this.drawImage(dataUrl)
    } else {
      if (this.canvas?.width && this.canvas.height) {
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }
  }

  redo(): void {
    if (this.redoList.length > 0) {
      const dataUrl: string = this.redoList.pop() as string
      if (this.canvas) {
        this.pushToUndo(this.canvas.toDataURL())
      }
      this.drawImage(dataUrl)
    }
  }
}

export default new CanvasState()
