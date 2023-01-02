import React from 'react'
import BarContainer from '../BarContainer/BarContainer'
import toolState from '../../store/toolState'
import BarPalette from '../BarPalette/BarPalette'
import { Storage } from '../../services/Storage/Storage.service'
import { StorageKeys } from '../../services/Storage/Storage.types'
import { DefaultValues } from '../../types/DefaultValues.types'
import useFillColor from '../../hooks/UseFillColor/useFillColor.hook'
import useStrokeColor from '../../hooks/UseStrokeColor/useStrokeColor.hook'
import BarInput from '../BarInput/BarInput'

const SettingsBar = () => {
  const fillColor = useFillColor(
    Storage.get(StorageKeys.fillColor) || DefaultValues.colorBlack
  )

  const strokeColor = useStrokeColor(
    Storage.get(StorageKeys.strokeColor) || DefaultValues.colorBlack
  )

  const barInputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    Storage.set(StorageKeys.lineWidth, e.target.value)
    toolState.setLineWidth(e.target.value)
  }

  return (
    <BarContainer>
      <div className="flex gap-[var(--bar-indent)]">
        <BarInput
          description="Толщина_контура"
          onChange={e => barInputHandler(e)}
          defaultValue={
            Storage.get(StorageKeys.lineWidth) || DefaultValues.lineWidth
          }
          min={1}
          max={50}
        />
        <BarPalette
          description="Цвет_заливки"
          value={fillColor.color}
          onChange={e => fillColor.changeColor(e)}
        />
        <BarPalette
          description="Цвет_контура"
          value={strokeColor.color}
          onChange={e => strokeColor.changeColor(e)}
        />
      </div>
    </BarContainer>
  )
}

export default SettingsBar
