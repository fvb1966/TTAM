import React from 'react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

export default function Header() {
  const now = new Date()
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="font-bold">TTAM</div>
        <Input placeholder="Buscar..." className="w-72" />
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <Badge>Administrador</Badge>
        <div>{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
      </div>
    </header>
  )
}
