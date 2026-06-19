import React, { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Alumnos from './pages/Alumnos'
import Pagos from './pages/Pagos'
import Torneos from './pages/Torneos'
import Inscripciones from './pages/Inscripciones'
import Reportes from './pages/Reportes'
import Settings from './pages/Settings'
import Login from './pages/Login'

export default function Layout() {
  const [page, setPage] = useState('dashboard')
  const [user, setUser] = useState<any>(null)

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
        case 'reportes':
          return <Reportes />
        case 'config':
          return <Settings />
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="mt-4">Bienvenido a TTAM — interfaz inicial.</p>
          </div>
        )
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const u = await (window as any).ttam.auth.me()
        if (!mounted) return
        setUser(u)
      } catch {
        setUser(null)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleSelect = async (k: string) => {
    if (k === 'exit') {
      await (window as any).ttam.auth.logout()
      setUser(null)
      setPage('dashboard')
      return
    }
    setPage(k)
  }

  if (!user) {
    return (
      <div className="h-screen flex bg-gray-50 text-slate-900">
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 overflow-auto">
            <Login onAuth={(u: any) => setUser(u)} />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-50 text-slate-900">
      <Sidebar current={page} onSelect={handleSelect} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">{renderMain()}</main>
      </div>
    </div>
  )
}
