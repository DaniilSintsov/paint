import React, {FC} from 'react'
import classes from './BarContainer.module.css'
import {IBarContainerProps} from './BarContainer.types'

const BarContainer: FC<IBarContainerProps> = ({children}) => {
  return (
    <div className={classes.bar}>
      <div className={classes.barContainer}>{children}</div>
    </div>
  )
}

export default BarContainer
