import {useState} from 'react'
import {Storage} from '../../services/Storage/Storage.service'
import {StorageKeys} from '../../services/Storage/Storage.types'
import toolState from '../../store/toolState'

export default function useFillColor(initialValue: string) {
  const storage = new Storage()
  const [color, setColor] = useState<string>(initialValue)

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    storage.set(StorageKeys.fillColor, e.target.value)
    toolState.setFillStyle(e.target.value)
    setColor(e.target.value)
  }

  return {color, changeColor}
}
