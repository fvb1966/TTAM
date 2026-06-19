import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

type Student = { id: number; firstName: string; lastName?: string; email?: string; phone?: string }
type Payment = { id: number; amountCents: number; currency: string; student?: Student; paidAt: string }

export default function Reportes() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const fetchStudents = async (): Promise<Student[]> => {
    const s = await window.ttam.db.getStudents()
    return s || []
  }

  const fetchPayments = async (): Promise<Payment[]> => {
    const p = await window.ttam.db.getPayments()
    return p || []
  }

  const exportStudentsPDF = async () => {
    setLoading(true)
    try {
      const students = await fetchStudents()
      const doc = new jsPDF()
      doc.setFontSize(12)
      doc.text('Alumnos', 10, 10)
      students.forEach((s, i) => {
        const y = 20 + i * 8
        const line = `${s.id} - ${s.firstName} ${s.lastName || ''} - ${s.email || ''} - ${s.phone || ''}`
        doc.text(line, 10, y)
      })
      doc.save('alumnos.pdf')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al exportar PDF')
    } finally {
      setLoading(false)
    }
  }

  const exportStudentsXLSX = async () => {
    setLoading(true)
    try {
      const students = await fetchStudents()
      const ws = XLSX.utils.json_to_sheet(students)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Alumnos')
      XLSX.writeFile(wb, 'alumnos.xlsx')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al exportar XLSX')
    } finally {
      setLoading(false)
    }
  }

  const exportPaymentsPDF = async () => {
    setLoading(true)
    try {
      const payments = await fetchPayments()
      const doc = new jsPDF()
      doc.setFontSize(12)
      doc.text('Pagos', 10, 10)
      payments.forEach((p, i) => {
        const y = 20 + i * 8
        const student = p.student ? `${p.student.firstName} ${p.student.lastName || ''}` : 'N/A'
        const line = `${p.id} - ${student} - ${(p.amountCents/100).toFixed(2)} ${p.currency} - ${new Date(p.paidAt).toLocaleDateString()}`
        doc.text(line, 10, y)
      })
      doc.save('pagos.pdf')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al exportar PDF')
    } finally {
      setLoading(false)
    }
  }

  const exportPaymentsXLSX = async () => {
    setLoading(true)
    try {
      const payments = await fetchPayments()
      const rows = payments.map(p => ({
        id: p.id,
        student: p.student ? `${p.student.firstName} ${p.student.lastName || ''}` : '',
        amount: (p.amountCents/100).toFixed(2),
        currency: p.currency,
        paidAt: p.paidAt,
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Pagos')
      XLSX.writeFile(wb, 'pagos.xlsx')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al exportar XLSX')
    } finally {
      setLoading(false)
    }
  }

  const exportDebtorsXLSX = async () => {
    setLoading(true)
    try {
      const students = await fetchStudents()
      const payments = await fetchPayments()
      const totals: Record<number, number> = {}
      payments.forEach(p => {
        const sid = p.student?.id
        if (!sid) return
        totals[sid] = (totals[sid] || 0) + (p.amountCents || 0)
      })
      const debtors = students
        .map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName || ''}`, totalPaid: ((totals[s.id] || 0)/100).toFixed(2) }))
        .filter(x => Number(x.totalPaid) === 0)
      const ws = XLSX.utils.json_to_sheet(debtors)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Deudores')
      XLSX.writeFile(wb, 'deudores.xlsx')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      showToast('error', 'Error al exportar XLSX')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Reportes</h3>

      <Card>
        <div className="flex gap-4">
          <div>
            <h4 className="font-medium">Alumnos</h4>
            <div className="mt-2 flex gap-2">
              <Button onClick={exportStudentsPDF} disabled={loading}>Exportar PDF</Button>
              <Button onClick={exportStudentsXLSX} disabled={loading}>Exportar XLSX</Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Pagos</h4>
            <div className="mt-2 flex gap-2">
              <Button onClick={exportPaymentsPDF} disabled={loading}>Exportar PDF</Button>
              <Button onClick={exportPaymentsXLSX} disabled={loading}>Exportar XLSX</Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Deudores</h4>
            <div className="mt-2 flex gap-2">
              <Button onClick={exportDebtorsXLSX} disabled={loading}>Exportar XLSX</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
