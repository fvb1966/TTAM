import React from 'react'
import { Home, Users, CreditCard, Trophy, FileText, Database, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'

type NavItem = { key: string; title: string; header?: boolean; icon?: React.ReactNode }

const nav: NavItem[] = [
  { key: 'dashboard', title: 'Dashboard', icon: <Home size={16} /> },
  { key: 'academy', title: 'ACADEMIA', header: true },
  { key: 'alumnos', title: 'Alumnos', icon: <Users size={16} /> },
  { key: 'pagos', title: 'Pagos', icon: <CreditCard size={16} /> },
  { key: 'torneos_header', title: 'TORNEOS', header: true },
  { key: 'torneos_list', title: 'Torneos', icon: <Trophy size={16} /> },
  { key: 'inscripciones', title: 'Inscripciones', icon: <FileText size={16} /> },
  { key: 'participantes', title: 'Participantes', icon: <Users size={16} /> },
  { key: 'grupos', title: 'Grupos', icon: <Database size={16} /> },
  { key: 'partidos', title: 'Partidos', icon: <FileText size={16} /> },
  { key: 'reportes', title: 'REPORTES', header: true },
  { key: 'backups', title: 'BACKUPS', icon: <Database size={16} /> },
  { key: 'config', title: 'CONFIGURACIÓN', icon: <Settings size={16} /> },
  { key: 'exit', title: 'SALIR', icon: <LogOut size={16} /> },
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
            className={cn(
              'flex items-center gap-3 px-2 py-2 rounded',
              item.header ? 'text-xs uppercase text-slate-500 pt-4 cursor-default' : (current === item.key ? 'bg-slate-100 font-medium cursor-pointer' : 'hover:bg-slate-100 cursor-pointer')
            )}
          >
            {item.icon && <span className="text-slate-500">{item.icon}</span>}
            <span>{item.title}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
