import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Alumnos from './pages/Alumnos'
import Pagos from './pages/Pagos'
import Torneos from './pages/Torneos'
import Inscripciones from './pages/Inscripciones'

export default function Layout() {
  const [page, setPage] = useState('dashboard')

  const renderMain = () => {
    switch (page) {
      case 'alumnos':
        return <Alumnos />
      case 'pagos':
        return <Pagos />
      case 'torneos_list':
        return <Torneos />
      case 'inscripciones':
        return <Inscripciones />
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="mt-4">Bienvenido a TTAM — interfaz inicial.</p>
          </div>
        )
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 text-slate-900">
      <Sidebar current={page} onSelect={setPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">{renderMain()}</main>
      </div>
    </div>
  )
}
