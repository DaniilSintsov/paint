import React from 'react'
import Canvas from './components/Canvas/Canvas'
import SettingsBar from './components/SettingsBar/SettingsBar'
import Toolbar from './components/Toolbar/Toolbar'

function App() {
  return (
    <React.Fragment>
      <div>
        <Toolbar />
        <SettingsBar />
      </div>
      <Canvas />
    </React.Fragment>
  )
}

export default App
