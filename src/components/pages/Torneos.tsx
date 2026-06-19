import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

type Tournament = { id: number; name: string; startDate?: string; endDate?: string }

export default function Torneos() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const load = async () => {
    const list = await window.ttam.db.getTournaments()
    setTournaments(list)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.ttam.db.createTournament({ name, startDate: startDate || null, endDate: endDate || null })
    setName('')
    setStartDate('')
    setEndDate('')
    load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Torneos</h3>

      <Card>
        <form onSubmit={handleCreate} className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm">Nombre</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm">Inicio</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Fin</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h4 className="text-lg font-medium">Torneos existentes</h4>
        <ul className="mt-2 space-y-2">
          {tournaments.map(t => (
            <li key={t.id} className="p-2 border rounded">{t.name} {t.startDate ? `— ${new Date(t.startDate).toLocaleDateString()}` : ''}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
