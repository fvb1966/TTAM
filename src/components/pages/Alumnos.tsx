import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

type Student = {
  id: number
  firstName: string
  lastName?: string
  email?: string
  phone?: string
}

export default function Alumnos() {
  const [students, setStudents] = useState<Student[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const load = async () => {
    const list = await window.ttam.db.getStudents()
    setStudents(list)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.ttam.db.createStudent({ firstName, lastName, email, phone })
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    load()
  }

  return (
    <div>
      <h3 className="text-xl font-medium">Alumnos</h3>
      <form onSubmit={handleCreate} className="mt-4 space-y-2 max-w-lg">
        <div className="flex gap-2">
          <input placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} className="flex-1 p-2 border rounded" required />
          <input placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} className="flex-1 p-2 border rounded" />
        </div>
        <div className="flex gap-2">
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 p-2 border rounded" />
          <input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} className="flex-1 p-2 border rounded" />
        </div>
        <div>
          <Button type="submit">Crear alumno</Button>
        </div>
      </form>

      <div className="mt-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Email</th>
              <th className="p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.firstName} {s.lastName}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
