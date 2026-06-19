import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>TTAM - Table Tennis Academy Manager</h1>
      <p>Interfaz inicial. Seguir fases del proyecto.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
