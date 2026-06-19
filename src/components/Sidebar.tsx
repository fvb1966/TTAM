import React from 'react'
import { Home, Users, CreditCard, Trophy, FileText, Database, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTranslation } from 'react-i18next'

type NavItem = { key: string; title?: string; titleKey?: string; header?: boolean; icon?: React.ReactNode }

const nav: NavItem[] = [
  { key: 'dashboard', titleKey: 'sidebar.dashboard', icon: <Home size={16} /> },
  { key: 'academy', titleKey: 'sidebar.academy', header: true },
  { key: 'alumnos', titleKey: 'sidebar.alumnos', icon: <Users size={16} /> },
  { key: 'pagos', titleKey: 'sidebar.pagos', icon: <CreditCard size={16} /> },
  { key: 'torneos_header', titleKey: 'sidebar.torneos', header: true },
  { key: 'torneos_list', titleKey: 'sidebar.torneos', icon: <Trophy size={16} /> },
  { key: 'inscripciones', titleKey: 'sidebar.inscripciones', icon: <FileText size={16} /> },
  { key: 'participantes', titleKey: 'sidebar.participantes', icon: <Users size={16} /> },
  { key: 'grupos', titleKey: 'sidebar.grupos', icon: <Database size={16} /> },
  { key: 'partidos', titleKey: 'sidebar.partidos', icon: <FileText size={16} /> },
  { key: 'reportes', titleKey: 'sidebar.reportes', header: true },
  { key: 'backups', titleKey: 'sidebar.backups', icon: <Database size={16} /> },
  { key: 'config', titleKey: 'sidebar.config', icon: <Settings size={16} /> },
  { key: 'exit', titleKey: 'sidebar.exit', icon: <LogOut size={16} /> },
]

export default function Sidebar({ current, onSelect }: { current?: string; onSelect?: (k: string) => void }) {
  const { t } = useTranslation()

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
            <span>{item.titleKey ? t(item.titleKey) : item.title}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
