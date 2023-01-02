import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Canvas from '../../components/Canvas/Canvas'
import SettingsBar from '../../components/SettingsBar/SettingsBar'
import Toolbar from '../../components/Toolbar/Toolbar'

const CanvasPage = () => {
  const validatePathRegExp = /f[0-9|a-z]{11}$/
  return validatePathRegExp.test(useParams().id as string) ? (
    <>
      <div>
        <Toolbar />
        <SettingsBar />
      </div>
      <Canvas />
    </>
  ) : (
    <Navigate to={'*'} />
  )
}

export default CanvasPage
