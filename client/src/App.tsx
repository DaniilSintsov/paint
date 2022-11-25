import React from 'react'
import Canvas from './components/Canvas/Canvas'
import SettingsBar from './components/SettingsBar/SettingsBar'
import Toolbar from './components/Toolbar/Toolbar'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <div>
                <Toolbar />
                <SettingsBar />
              </div>
              <Canvas />
            </>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={`f${(+new Date()).toString(16)}`}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
