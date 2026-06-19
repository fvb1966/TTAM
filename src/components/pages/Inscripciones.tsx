import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Papa from 'papaparse'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type Tournament = { id: number; name: string }
type CsvRow = Record<string, string>
type ImportIssue = { field?: string; fieldLabel?: string; message: string; code?: string; friendly?: string }
type ImportError = { index: number; row?: CsvRow; issues: ImportIssue[] }
type ImportResult = { imported: number; details?: Array<{ studentId: number; registrationId: number }>; errors?: ImportError[] }

export default function Inscripciones() {
  const { t } = useTranslation()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [tournamentId, setTournamentId] = useState<number | null>(null)
  const [csvData, setCsvData] = useState<CsvRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string }>({})
  const [preview, setPreview] = useState<CsvRow[]>([])
  const [errors, setErrors] = useState<ImportError[]>([])
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [loading, setLoading] = useState(false)

  const loadTournaments = async () => {
    const list = await window.ttam.db.getTournaments()
    setTournaments(list as Tournament[])
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      await loadTournaments()
    })()
    return () => { mounted = false }
  }, [])

  const handleFile = (file: File | null) => {
    if (!file) return
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data as CsvRow[]
        setCsvData(data)
        const h = (res.meta.fields || []) as string[]
        setHeaders(h)
        setPreview(data.slice(0, 5))
        // try auto-mapping
        const lower = h.map((x) => (x || '').toLowerCase())
        setMapping({
          firstName: h[lower.findIndex((x) => x.includes('nombre') || x.includes('first'))] || undefined,
          lastName: h[lower.findIndex((x) => x.includes('apellido') || x.includes('last'))] || undefined,
          email: h[lower.findIndex((x) => x.includes('email'))] || undefined,
          phone: h[lower.findIndex((x) => x.includes('tel') || x.includes('phone'))] || undefined,
        })
      }
    })
  }

  const handleImport = async () => {
    if (!tournamentId) return alert(t('inscriptions.selectTournamentAlert'))
    if (!csvData.length) return alert(t('inscriptions.uploadCsvAlert'))
    const rows = csvData.map(r => ({
      firstName: mapping.firstName ? r[mapping.firstName] : undefined,
      lastName: mapping.lastName ? r[mapping.lastName] : undefined,
      email: mapping.email ? r[mapping.email] : undefined,
      phone: mapping.phone ? r[mapping.phone] : undefined,
    }))
    setLoading(true)
    try {
      const result = (await window.ttam.db.importRegistrations({ tournamentId, rows })) as ImportResult
      setImportResult(result)
      setErrors(result.errors || [])
      alert(t('inscriptions.importedCount', { count: result.imported }))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert(t('inscriptions.importError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">{t('inscriptions.title')}</h3>

      <Card>
        <div className="flex gap-4 items-end">
            <div>
            <label className="block text-sm">Torneo</label>
            <select value={tournamentId ?? ''} onChange={e => setTournamentId(Number(e.target.value) || null)} className="p-2 border rounded">
              <option value="">{t('inscriptions.selectPlaceholder')}</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm">CSV</label>
            <input type="file" accept=".csv,text/csv" onChange={e => handleFile(e.target.files ? e.target.files[0] : null)} />
          </div>

          <div>
            <Button onClick={handleImport} disabled={loading || !tournamentId || !csvData.length}>{loading ? t('inscriptions.importing') : t('inscriptions.import')}</Button>
          </div>
        </div>
      </Card>

      {importResult && (
        <Card>
          <h4 className="text-sm font-medium">{t('inscriptions.resultTitle')}</h4>
          <div className="mt-2">
            <div>{t('inscriptions.importedCount', { count: importResult.imported })}</div>
            <div>Detalles: {importResult.details ? importResult.details.length : 0}</div>
          </div>
        </Card>
      )}

      {errors.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-red-600">{t('inscriptions.errorsTitle', { count: errors.length })}</h4>
            <div>
              <Button onClick={() => {
                // exportar errores a CSV
                const rows = errors.flatMap(err => err.issues.map((i: ImportIssue) => ({
                  fila: err.index,
                  campo: i.fieldLabel || i.field || '',
                  mensaje: i.friendly || i.message,
                })))
                const csv = Papa.unparse(rows)
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `errores_importacion_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
              }}>{t('inscriptions.exportButton')}</Button>
            </div>
          </div>

          <div className="mt-2 overflow-auto">
            <ul className="space-y-2">
              {errors.map((err, idx) => (
                <li key={idx} className="p-2 border rounded">
                  <div className="font-semibold">Fila: {err.index}</div>
                  {err.row && <div className="text-xs mb-2">{t('inscriptions.record')} <pre className="whitespace-pre-wrap">{JSON.stringify(err.row)}</pre></div>}
                  <ul className="text-sm list-disc pl-5">
                    {err.issues.map((i: ImportIssue, ii: number) => (
                          <li key={ii}>{i.friendly ? i.friendly : `${i.fieldLabel}: ${i.message}`}</li>
                        ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {headers.length > 0 && (
        <Card>
          <h4 className="text-sm font-medium">{t('inscriptions.mappingTitle')}</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-xs">{t('fields.firstName')} (firstName)</label>
              <select value={mapping.firstName || ''} onChange={e => setMapping({ ...mapping, firstName: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">{t('fields.lastName')} (lastName)</label>
              <select value={mapping.lastName || ''} onChange={e => setMapping({ ...mapping, lastName: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">{t('fields.email')}</label>
              <select value={mapping.email || ''} onChange={e => setMapping({ ...mapping, email: e.target.value || undefined })} className="p-2 border rounded w-full">
                <option value="">---</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs">{t('fields.phone')}</label>
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
          <h4 className="text-sm font-medium">{t('inscriptions.previewTitle')}</h4>
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
