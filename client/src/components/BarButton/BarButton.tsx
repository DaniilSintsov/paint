/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx, css} from '@emotion/react'
import React, {FC} from 'react'
import {IBarButtonProps} from './BarButton.types'

const BarButton: FC<IBarButtonProps> = ({
  image,
  description,
  onClick,
  tipAlign
}) => {
  return (
    <button onClick={onClick}>
      <div
        data-description={description}
        css={css`
          height: var(--bar-button-size);
          width: var(--bar-button-size);
          position: relative;
          background: url('${image}') center / contain no-repeat;
        `}
        className={`tip tip-align-${tipAlign}`}
      />
    </button>
  )
}

export default BarButton
