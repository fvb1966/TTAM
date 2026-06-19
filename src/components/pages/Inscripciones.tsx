import React, { useEffect, useState } from 'react'
import Papa from 'papaparse'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Inscripciones() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [tournamentId, setTournamentId] = useState<number | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string }>({})
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [importResult, setImportResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadTournaments() }, [])

  const loadTournaments = async () => {
    const list = await window.ttam.db.getTournaments()
    setTournaments(list)
  }

  const handleFile = (file: File | null) => {
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setCsvData(res.data as any[])
        const h = res.meta.fields || []
        setHeaders(h as string[])
        setPreview((res.data as any[]).slice(0, 5))
        // try auto-mapping
        const lower = h.map((x: string) => (x || '').toLowerCase())
        setMapping({
          firstName: h[lower.findIndex((x: string) => x.includes('nombre') || x.includes('first'))] || undefined,
          lastName: h[lower.findIndex((x: string) => x.includes('apellido') || x.includes('last'))] || undefined,
          email: h[lower.findIndex((x: string) => x.includes('email'))] || undefined,
          phone: h[lower.findIndex((x: string) => x.includes('tel') || x.includes('phone'))] || undefined,
        })
      }
    })
  }

  const handleImport = async () => {
    if (!tournamentId) return alert('Seleccione un torneo')
    if (!csvData.length) return alert('Cargue un CSV')
    const rows = csvData.map(r => ({
      firstName: mapping.firstName ? r[mapping.firstName] : undefined,
      lastName: mapping.lastName ? r[mapping.lastName] : undefined,
      email: mapping.email ? r[mapping.email] : undefined,
      phone: mapping.phone ? r[mapping.phone] : undefined,
    }))
    setLoading(true)
    try {
      const result = await window.ttam.db.importRegistrations({ tournamentId, rows })
      setImportResult(result)
      setErrors(result.errors || [])
      alert(`Importadas: ${result.imported}`)
    } catch (e) {
      console.error(e)
      alert('Error durante la importación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Inscripciones (Importar CSV)</h3>

      <Card>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm">Torneo</label>
            <select value={tournamentId ?? ''} onChange={e => setTournamentId(Number(e.target.value) || null)} className="p-2 border rounded">
              <option value="">Seleccionar</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm">CSV</label>
            <input type="file" accept=".csv,text/csv" onChange={e => handleFile(e.target.files ? e.target.files[0] : null)} />
          </div>

          <div>
            <Button onClick={handleImport} disabled={loading || !tournamentId || !csvData.length}>{loading ? 'Importando...' : 'Importar'}</Button>
          </div>
        </div>
      </Card>

      {importResult && (
        <Card>
          <h4 className="text-sm font-medium">Resultado de importación</h4>
          <div className="mt-2">
            <div>Importadas: {importResult.imported}</div>
            <div>Detalles: {importResult.details ? importResult.details.length : 0}</div>
          </div>
        </Card>
      )}

      {errors.length > 0 && (
        <Card>
          <h4 className="text-sm font-medium text-red-600">Errores ({errors.length})</h4>
          <div className="mt-2 overflow-auto">
            <ul className="space-y-2">
              {errors.map((err, idx) => (
                <li key={idx} className="p-2 border rounded">
                  <div className="font-semibold">Fila: {err.index}</div>
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(err.issues, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {headers.length > 0 && (
        <Card>
          <h4 className="text-sm font-medium">Mapeo de columnas</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-xs">Nombre (firstName)</label>
              <select value={mapping.firstName || ''} onChange={e => setMapping({ ...mapping, firstName: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">Apellido (lastName)</label>
              <select value={mapping.lastName || ''} onChange={e => setMapping({ ...mapping, lastName: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">Email</label>
              <select value={mapping.email || ''} onChange={e => setMapping({ ...mapping, email: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">Teléfono</label>
              <select value={mapping.phone || ''} onChange={e => setMapping({ ...mapping, phone: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </Card>
      )}

      {preview.length > 0 && (
        <Card>
          <h4 className="text-sm font-medium">Vista previa</h4>
          <div className="mt-2 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {headers.map(h => <th key={h} className="p-2 text-left">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    {headers.map(h => <td key={h} className="p-2">{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
