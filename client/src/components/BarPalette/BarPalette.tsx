/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { FC } from 'react'
import { IBarPaletteProps } from './BarPalette.types'

const BarPalette: FC<IBarPaletteProps> = ({ onChange, description, value }) => {
  return (
    <div
      className="tip tip-align-left"
      data-description={description}>
      <div
        css={css`
          height: var(--bar-button-size);
          width: var(--bar-button-size);
          overflow: hidden;
          border-radius: var(--border-radius);
        `}>
        <input
          onChange={onChange}
          type="color"
          value={value}
          css={css`
            cursor: pointer;
            height: 100%;
            width: 100%;
            border: var(--border-weight) solid var(--border-color);
            border-radius: var(--border-radius);
            &:focus {
              border: var(--border-weight) solid var(--border-focus-color);
            }
          `}
        />
      </div>
    </div>
  )
}
export default BarPalette
