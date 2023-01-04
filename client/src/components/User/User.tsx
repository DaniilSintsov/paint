/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC } from 'react'
import { css, jsx } from '@emotion/react'
import avatarImg from '../../assets/img/avatar.png'
import { IUserProps } from './User.types'

const User: FC<IUserProps> = ({ description }) => {
  const colors: string[] = [
    'red',
    'orange',
    'navy',
    'green',
    'blue',
    'purple',
    'saddlebrown'
  ]

  const getRandomColor = (colors: string[]): string => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div
      className="tip tip-align-right"
      data-description={description}
      css={css`
        height: var(--bar-button-size);
        width: var(--bar-button-size);
        border: var(--border-weight) solid ${getRandomColor(colors)};
      `}>
      <img
        src={avatarImg}
        alt="avatar"
      />
    </div>
  )
}

export default User
