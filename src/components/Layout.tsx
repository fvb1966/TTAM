import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="h-screen flex bg-gray-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="mt-4">Bienvenido a TTAM — interfaz inicial.</p>
        </main>
      </div>
    </div>
  )
}
