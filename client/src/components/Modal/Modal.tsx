import React, { FC, useState } from 'react'
import classes from './Modal.module.css'
import { observer } from 'mobx-react-lite'
import { IModalProps } from './Modal.types'
import canvasState from '../../store/canvasState'

const Modal: FC<IModalProps> = observer(({ show, setShow }) => {
  const [value, setValue] = useState<string>('')

  const loginHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (value.trim()) {
      canvasState.setUsername(value.trim())
      setShow(false)
    }
  }

  return (
    <div className={`${classes.modal} ${show ? classes.active : ''}`}>
      <div className={classes.modalContent}>
        <form onSubmit={e => loginHandler(e)}>
          <input
            className={classes.modalInput}
            type="text"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <button className={classes.modalButton}>Войти</button>
        </form>
      </div>
    </div>
  )
})

export default Modal
