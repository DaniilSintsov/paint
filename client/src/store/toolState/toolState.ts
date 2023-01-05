import { makeAutoObservable } from 'mobx'
import { ITool } from '../../services/tools/Tool/Tool'

interface IToolState {
  tool: ITool | null
  setTool: <T extends ITool>(tool: T) => void
  setFillStyle: (color: string) => void
  setStrokeStyle: (color: string) => void
  setLineWidth: (width: string) => void
}

class ToolState implements IToolState {
  tool: ITool | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setTool<T extends ITool>(tool: T) {
    this.tool = tool
  }

  setFillStyle(color: string): void {
    if (this.tool) this.tool.fillStyle = color
  }

  setStrokeStyle(color: string): void {
    if (this.tool) this.tool.strokeStyle = color
  }

  setLineWidth(width: string): void {
    if (this.tool) this.tool.lineWidth = +width
  }
}

export default new ToolState()
