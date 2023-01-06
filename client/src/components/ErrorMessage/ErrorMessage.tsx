import React, { FC } from 'react'
import { IErrorMessageProps } from './ErrorMessage.types'
import classes from './ErrorMessage.module.css'

const ErrorMessage: FC<IErrorMessageProps> = ({ children }) => {
  return <div className={classes.errorMessage}>{children}</div>
}

export default ErrorMessage
