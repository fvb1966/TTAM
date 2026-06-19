import React from 'react'

export default function Header() {
  const now = new Date()
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-bold">TTAM</div>
      <div className="text-sm text-slate-600">Administrador • {now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
    </header>
  )
}
