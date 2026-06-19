import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

type Student = { id: number; firstName: string; lastName?: string }
type Payment = { id: number; amountCents: number; currency: string; student?: Student; paidAt: string }

export default function Pagos() {
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [studentId, setStudentId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')

  const load = async () => {
    const s = await window.ttam.db.getStudents()
    setStudents(s)
    const p = await window.ttam.db.getPayments()
    setPayments(p)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return
    const amountCents = Math.round(parseFloat(amount || '0') * 100)
    await window.ttam.db.createPayment({ studentId, amountCents })
    setAmount('')
    load()
  }

  return (
    <div>
      <h3 className="text-xl font-medium">Pagos</h3>

      <form onSubmit={handleCreate} className="mt-4 flex items-end gap-2">
        <div>
          <label className="block text-sm">Alumno</label>
          <select value={studentId ?? ''} onChange={e => setStudentId(Number(e.target.value) || null)} className="p-2 border rounded">
            <option value="">Seleccionar</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Monto (ARS)</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="p-2 border rounded" />
        </div>
        <div>
          <Button type="submit" variant="default">Registrar pago</Button>
        </div>
      </form>

      <div className="mt-6">
        <h4 className="text-lg font-medium">Últimos pagos</h4>
        <ul className="mt-2 space-y-2">
          {payments.map(p => (
            <li key={p.id} className="p-2 border rounded">
              {p.student ? `${p.student.firstName} ${p.student.lastName || ''}` : 'Alumno desconocido'} — {(p.amountCents/100).toFixed(2)} {p.currency} — {new Date(p.paidAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
