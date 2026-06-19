import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const [locale, setLocale] = useState(i18n.language || 'es')
  const [currency, setCurrency] = useState('ARS')
  const [dbPath, setDbPath] = useState('')
  const [backupDir, setBackupDir] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const cfg = (await (window as any).ttam.settings.get()) || {}
        const paths = (await (window as any).ttam.settings.paths()) || {}
        if (!mounted) return
        setLocale(cfg.locale || (await (window as any).ttam.getLocale()) || i18n.language || 'es')
        setCurrency(cfg.currency || 'ARS')
        setBackupDir(cfg.backupDir || (paths.backupDir || ''))
        setDbPath(paths.dbPath || '')
      } catch (err) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      await (window as any).ttam.settings.set({ locale, currency, backupDir })
      // change renderer language (this also persists via i18n listener)
      await i18n.changeLanguage(locale)
      alert('Ajustes guardados')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error al guardar ajustes')
    } finally {
      setLoading(false)
    }
  }

  const handleBackupNow = async () => {
    setLoading(true)
    try {
      const p = await (window as any).ttam.backup.create()
      alert(`Backup creado: ${p}`)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error al crear backup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Ajustes</h3>

      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Idioma</label>
            <select value={locale} onChange={e => setLocale(e.target.value)} className="p-2 border rounded w-full">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Moneda</label>
            <input className="p-2 border rounded w-full" value={currency} onChange={e => setCurrency(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm">Base de datos</label>
            <input className="p-2 border rounded w-full bg-gray-50" value={dbPath} readOnly />
          </div>

          <div>
            <label className="block text-sm">Directorio de backups</label>
            <input className="p-2 border rounded w-full" value={backupDir} onChange={e => setBackupDir(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave} disabled={loading}>Guardar ajustes</Button>
          <Button onClick={handleBackupNow} variant="ghost" disabled={loading}>Crear backup ahora</Button>
        </div>
      </Card>
    </div>
  )
}
