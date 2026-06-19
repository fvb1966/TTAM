import React from 'react'

const nav = [
  { title: 'Dashboard' },
  { title: 'ACADEMIA' },
  { title: '— Alumnos' },
  { title: '— Pagos' },
  { title: 'TORNEOS' },
  { title: '— Torneos' },
  { title: '— Inscripciones' },
  { title: '— Participantes' },
  { title: '— Grupos' },
  { title: '— Partidos' },
  { title: 'REPORTES' },
  { title: 'BACKUPS' },
  { title: 'CONFIGURACIÓN' },
  { title: 'SALIR' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-6 text-lg font-semibold">TTAM</div>
      <nav className="space-y-2 text-sm text-slate-700">
        {nav.map((item, i) => (
          <div key={i} className="px-2 py-1 hover:bg-slate-100 rounded">{item.title}</div>
        ))}
      </nav>
    </aside>
  )
}
