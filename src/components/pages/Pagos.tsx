import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

type Student = { id: number; firstName: string; lastName?: string }
type Payment = { id: number; amountCents: number; currency: string; student?: Student; paidAt: string }

type EditPayment = { id: number; studentId?: number | null; amount?: string }

export default function Pagos() {
  const { t } = useTranslation()
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [studentId, setStudentId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStudentId, setEditStudentId] = useState<number | null>(null)
  const [editAmount, setEditAmount] = useState('')

  const load = async () => {
    const s = await window.ttam.db.getStudents()
    setStudents(s)
    const p = await window.ttam.db.getPayments()
    setPayments(p)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const s = await window.ttam.db.getStudents()
      if (!mounted) return
      setStudents(s)
      const p = await window.ttam.db.getPayments()
      if (!mounted) return
      setPayments(p)
    })()
    return () => { mounted = false }
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return
    const amountCents = Math.round(parseFloat(amount || '0') * 100)
    await window.ttam.db.createPayment({ studentId, amountCents })
    setAmount('')
    load()
  }

  const startEdit = (p: Payment) => {
    setEditingId(p.id)
    setEditStudentId(p.student ? p.student.id : null)
    setEditAmount(((p.amountCents || 0) / 100).toFixed(2))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditStudentId(null)
    setEditAmount('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    const amountCents = Math.round(parseFloat(editAmount || '0') * 100)
    await window.ttam.db.updatePayment({ id: editingId, amountCents, studentId: editStudentId })
    cancelEdit()
    load()
  }

  const handleDeletePayment = async (id: number) => {
    if (!confirm('¿Eliminar pago?')) return
    try {
      await window.ttam.db.deletePayment(id)
      load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error al borrar pago')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">{t('pagos.title')}</h3>

      <Card>
        <form onSubmit={handleCreate} className="mt-0 flex items-end gap-4">
          <div>
            <label className="block text-sm">{t('pagos.studentLabel')}</label>
            <select value={studentId ?? ''} onChange={e => setStudentId(Number(e.target.value) || null)} className="p-2 border rounded">
              <option value="">{t('inscriptions.selectPlaceholder')}</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">{t('pagos.amountLabel')}</label>
            <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Button type="submit" variant="default">{t('buttons.registerPayment')}</Button>
          </div>
        </form>
      </Card>

      {editingId && (
        <Card>
          <h4 className="text-sm font-medium">Editar pago</h4>
          <form onSubmit={handleUpdate} className="mt-2 flex items-end gap-4">
            <div>
              <label className="block text-sm">{t('pagos.studentLabel')}</label>
              <select value={editStudentId ?? ''} onChange={e => setEditStudentId(Number(e.target.value) || null)} className="p-2 border rounded">
                <option value="">{t('inscriptions.selectPlaceholder')}</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">{t('pagos.amountLabel')}</label>
              <Input value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <Button type="submit">Guardar</Button>
              <Button type="button" variant="ghost" onClick={cancelEdit}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h4 className="text-lg font-medium">{t('pagos.latestPayments')}</h4>
        <ul className="mt-2 space-y-2">
          {payments.map(p => (
            <li key={p.id} className="p-2 border rounded">
              <div className="flex justify-between items-center">
                <div>{p.student ? `${p.student.firstName} ${p.student.lastName || ''}` : t('pagos.studentUnknown')} — {(p.amountCents/100).toFixed(2)} {p.currency} — {new Date(p.paidAt).toLocaleString()}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => startEdit(p)}>Editar</Button>
                  <Button variant="destructive" onClick={() => handleDeletePayment(p.id)}>Borrar</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
