/** @jsxRuntime classic */
/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import {FC} from 'react'
import {IBarPaletteProps} from './BarPalette.types'

const BarPalette: FC<IBarPaletteProps> = ({onChange, description, value}) => {
  return (
    <div
      className="tip tip-align-left"
      data-description={description}>
      <input
        onChange={onChange}
        type="color"
        value={value}
        css={css`
          border: var(--border-weight) solid black;
        `}
        className="h-[var(--bar-button-size)] w-[var(--bar-button-size)] border-[var(--border-weight)] cursor-pointer"
      />
    </div>
  )
}
export default BarPalette
