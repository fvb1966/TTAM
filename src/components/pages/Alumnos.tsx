import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/Confirm'

type Student = {
  id: number
  firstName: string
  lastName?: string
  email?: string
  phone?: string
}

export default function Alumnos() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const confirm = useConfirm()
  const [students, setStudents] = useState<Student[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')

  const load = async () => {
    const list = await window.ttam.db.getStudents()
    setStudents(list)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const list = await window.ttam.db.getStudents()
      if (!mounted) return
      setStudents(list)
    })()
    return () => { mounted = false }
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

  const startEdit = (s: Student) => {
    setEditingId(s.id)
    setEditFirstName(s.firstName)
    setEditLastName(s.lastName || '')
    setEditEmail(s.email || '')
    setEditPhone(s.phone || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFirstName('')
    setEditLastName('')
    setEditEmail('')
    setEditPhone('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    await window.ttam.db.updateStudent({ id: editingId, firstName: editFirstName, lastName: editLastName || null, email: editEmail || null, phone: editPhone || null })
    cancelEdit()
    load()
  }

  const handleDeleteStudent = async (id: number) => {
    const ok = await confirm('¿Eliminar alumno?')
    if (!ok) return
    try {
      await window.ttam.db.deleteStudent(id)
      load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al borrar alumno')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">{t('alumnos.title')}</h3>

      <Card>
        <form onSubmit={handleCreate} className="mt-0 space-y-2 max-w-lg">
          <div className="flex gap-2">
            <Input placeholder={t('fields.firstName') as string} value={firstName} onChange={e => setFirstName(e.target.value)} required className="flex-1" />
            <Input placeholder={t('fields.lastName') as string} value={lastName} onChange={e => setLastName(e.target.value)} className="flex-1" />
          </div>
          <div className="flex gap-2">
            <Input placeholder={t('fields.email') as string} value={email} onChange={e => setEmail(e.target.value)} className="flex-1" />
            <Input placeholder={t('fields.phone') as string} value={phone} onChange={e => setPhone(e.target.value)} className="flex-1" />
          </div>
          <div>
            <Button type="submit">{t('buttons.createStudent')}</Button>
          </div>
        </form>
      </Card>

      {editingId && (
        <Card>
          <h4 className="text-sm font-medium">Editar alumno</h4>
          <form onSubmit={handleUpdate} className="mt-2 space-y-2 max-w-lg">
            <div className="flex gap-2">
              <Input placeholder={t('fields.firstName') as string} value={editFirstName} onChange={e => setEditFirstName(e.target.value)} required className="flex-1" />
              <Input placeholder={t('fields.lastName') as string} value={editLastName} onChange={e => setEditLastName(e.target.value)} className="flex-1" />
            </div>
            <div className="flex gap-2">
              <Input placeholder={t('fields.email') as string} value={editEmail} onChange={e => setEditEmail(e.target.value)} className="flex-1" />
              <Input placeholder={t('fields.phone') as string} value={editPhone} onChange={e => setEditPhone(e.target.value)} className="flex-1" />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Guardar</Button>
              <Button type="button" variant="ghost" onClick={cancelEdit}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">{t('fields.firstName')} {t('fields.lastName')}</th>
              <th className="p-2">{t('fields.email')}</th>
              <th className="p-2">{t('fields.phone')}</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.firstName} {s.lastName}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => startEdit(s)}>Editar</Button>
                    <Button variant="destructive" onClick={() => handleDeleteStudent(s.id)}>Borrar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
