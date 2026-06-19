import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

      <Card>
        <Table>
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">{t('fields.firstName')} {t('fields.lastName')}</th>
              <th className="p-2">{t('fields.email')}</th>
              <th className="p-2">{t('fields.phone')}</th>
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
