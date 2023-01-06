import React, { FC } from 'react'
import classes from './Modal.module.css'
import { observer } from 'mobx-react-lite'
import { IModalProps } from './Modal.types'
import connectionState from '../../store/connectionState/connectionState'
import { FormikErrors, FormikValues, useFormik } from 'formik'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

const Modal: FC<IModalProps> = observer(({ show, setShow }) => {
  const validate = (values: FormikValues) => {
    const errors: FormikErrors<FormikValues> = {}

    if (!values.username.trim()) {
      errors.username = 'Это обязательное поле!'
    } else if (values.username.trim().length > 10) {
      errors.username = 'Логин не может быть длиннее 10 символов!'
    }

    return errors
  }

  const formHandler = useFormik({
    initialValues: {
      username: ''
    },
    validate,
    onSubmit: values => {
      const username = values.username.trim().replaceAll(' ', '_')
      if (username) {
        const lenOfFractionalPart: number = 16
        connectionState.setUserId(
          username + Math.random().toFixed(lenOfFractionalPart)
        ) // this is done so that all usernames are unique
        setShow(false)
      }
    }
  })

  return (
    <div className={`${classes.modal} ${show ? classes.active : ''}`}>
      <div className={classes.modalContent}>
        <form onSubmit={formHandler.handleSubmit}>
          <div className={classes.modalInputWrapper}>
            <input
              className={
                formHandler.errors.username && formHandler.touched.username
                  ? classes.modalInputError
                  : classes.modalInput
              }
              placeholder="Логин:"
              name="username"
              autoFocus
              type="text"
              onChange={formHandler.handleChange}
              onBlur={formHandler.handleBlur}
              value={formHandler.values.username}
            />
            {formHandler.errors.username && formHandler.touched.username ? (
              <ErrorMessage>{formHandler.errors.username}</ErrorMessage>
            ) : null}
          </div>
          <button className={classes.modalButton}>Войти</button>
        </form>
      </div>
    </div>
  )
})

export default Modal
