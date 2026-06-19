import React from 'react'

type NavItem = { key: string; title: string; header?: boolean }

const nav: NavItem[] = [
  { key: 'dashboard', title: 'Dashboard' },
  { key: 'academy', title: 'ACADEMIA', header: true },
  { key: 'alumnos', title: 'Alumnos' },
  { key: 'pagos', title: 'Pagos' },
  { key: 'torneos', title: 'TORNEOS', header: true },
  { key: 'torneos_list', title: 'Torneos' },
  { key: 'inscripciones', title: 'Inscripciones' },
  { key: 'participantes', title: 'Participantes' },
  { key: 'grupos', title: 'Grupos' },
  { key: 'partidos', title: 'Partidos' },
  { key: 'reportes', title: 'REPORTES', header: true },
  { key: 'backups', title: 'BACKUPS' },
  { key: 'config', title: 'CONFIGURACIÓN' },
  { key: 'exit', title: 'SALIR' },
]

export default function Sidebar({ current, onSelect }: { current?: string; onSelect?: (k: string) => void }) {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-6 text-lg font-semibold">TTAM</div>
      <nav className="space-y-2 text-sm text-slate-700">
        {nav.map(item => (
          <div
            key={item.key}
            onClick={() => !item.header && onSelect && onSelect(item.key)}
            className={
              `px-2 py-1 rounded ` +
              (item.header ? 'text-xs uppercase text-slate-500 pt-4' : (current === item.key ? 'bg-slate-100 font-medium' : 'hover:bg-slate-100'))
            }
            style={{ cursor: item.header ? 'default' : 'pointer' }}
          >
            {item.title}
          </div>
        ))}
      </nav>
    </aside>
  )
}
