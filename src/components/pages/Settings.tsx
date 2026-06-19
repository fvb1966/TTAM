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
  const [remember, setRemember] = useState(false)
  const [backups, setBackups] = useState<Array<{ name: string; path: string; mtime: number }>>([])
  const [selectedBackup, setSelectedBackup] = useState('')
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
        setRemember(Boolean(cfg.authRemember))
        setDbPath(paths.dbPath || '')
        // fetch available backups
        try {
          const list = await (window as any).ttam.backup.list()
          setBackups(list || [])
          if ((list || []).length > 0) setSelectedBackup(list[0].path)
        } catch {
          // ignore
        }
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
      try {
        const list = await (window as any).ttam.backup.list()
        setBackups(list || [])
      } catch {}
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error al crear backup')
    } finally {
      setLoading(false)
    }
  }

  const fetchBackups = async () => {
    setLoading(true)
    try {
      const list = await (window as any).ttam.backup.list()
      setBackups(list || [])
      if ((list || []).length > 0) setSelectedBackup(list[0].path)
    } catch (err) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!selectedBackup) return alert('Seleccione un backup para restaurar')
    const ok = confirm('Se hará una copia de seguridad del estado actual antes de restaurar. ¿Continuar?')
    if (!ok) return
    setLoading(true)
    try {
      const res = await (window as any).ttam.backup.restore(selectedBackup)
      if (res && res.restored) {
        alert('Restauración completada. Se creó copia previa: ' + (res.preRestoreBackup || ''))
      } else {
        alert('Error al restaurar backup: ' + (res && res.error ? res.error : 'desconocido'))
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Error al restaurar backup')
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

          <div>
            <label className="block text-sm">Recordarme</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="text-sm text-slate-600">Mantener sesión iniciada entre reinicios</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave} disabled={loading}>Guardar ajustes</Button>
          <Button onClick={handleBackupNow} variant="ghost" disabled={loading}>Crear backup ahora</Button>
          <Button onClick={async () => { await (window as any).ttam.auth.logout(); window.location.reload() }} variant="destructive">Cerrar sesión</Button>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-medium">Restaurar backup</h4>
          <div className="mt-2 flex gap-2 items-center">
            <select className="p-2 border rounded w-full" value={selectedBackup} onChange={e => setSelectedBackup(e.target.value)}>
              {backups.map(b => (
                <option key={b.path} value={b.path}>{b.name} — {new Date(b.mtime).toLocaleString()}</option>
              ))}
            </select>
            <Button onClick={fetchBackups} variant="ghost" disabled={loading}>Listar</Button>
            <Button onClick={handleRestore} disabled={loading}>Restaurar</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
