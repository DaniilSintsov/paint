/** @jsxRuntime classic */
/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import React, {FC} from 'react'
import {IBarInputProps} from './BarInput.types'

const BarInput: FC<IBarInputProps> = ({
  max,
  min,
  onChange,
  defaultValue,
  description
}) => {
  function inputHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    if (+e.target.value > max) {
      e.target.value = max.toString()
    } else if (+e.target.value < min) {
      e.target.value = min.toString()
    }
    onChange(e)
  }

  return (
    <div
      className="tip tip-align-left"
      data-description={description}>
      <input
        onChange={e => inputHandler(e)}
        css={css`
          border: var(--border-weight) solid black;
          outline: none;
          height: var(--bar-button-size);
          width: 60px;
        `}
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
      />
    </div>
  )
}

export default BarInput
