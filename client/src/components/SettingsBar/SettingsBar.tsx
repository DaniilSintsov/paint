import React from 'react'
import BarContainer from '../BarContainer/BarContainer'
import toolState from '../../store/toolState'
import BarPalette from '../BarPalette/BarPalette'
import {Storage} from '../../services/Storage/Storage.service'
import {StorageKeys} from '../../services/Storage/Storage.types'
import {DefaultColors} from '../../services/tools/Tool/Tool.types'
import useFillColor from '../../hooks/UseFillColor/useFillColor.hook'
import useStrokeColor from '../../hooks/UseStrokeColor/useStrokeColor.hook'
import BarInput from '../BarInput/BarInput'

const SettingsBar = () => {
  const storage = new Storage()

  const fillColor = useFillColor(
    storage.get(StorageKeys.fillColor) || DefaultColors.black
  )

  const strokeColor = useStrokeColor(
    storage.get(StorageKeys.strokeColor) || DefaultColors.black
  )

  return (
    <BarContainer>
      <div className="flex gap-[var(--bar-indent)]">
        <BarInput
          description="Толщина_контура"
          onChange={e => toolState.setLineWidth(e.target.value)}
          defaultValue={1}
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
