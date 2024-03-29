import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CanvasPage from './pages/CanvasPage/CanvasPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:id"
          element={<CanvasPage />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to={`f${(+new Date()).toString(16)}`} // this is done so that session IDs are unique
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
