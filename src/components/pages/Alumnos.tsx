import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'

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
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Alumnos</h3>

      <Card>
        <form onSubmit={handleCreate} className="mt-0 space-y-2 max-w-lg">
          <div className="flex gap-2">
            <Input placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} required className="flex-1" />
            <Input placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} className="flex-1" />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" />
            <Input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} className="flex-1" />
          </div>
          <div>
            <Button type="submit">Crear alumno</Button>
          </div>
        </form>
      </Card>

      <Card>
        <Table>
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
        </Table>
      </Card>
    </div>
  )
}
