import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useTranslation } from 'react-i18next'

type TTAMWindow = Window & { ttam?: { getLocale?: () => Promise<string>; setLocale?: (l: string) => Promise<string | null> } }

export default function Header() {
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState<string>(i18n.language || 'es')
  const now = new Date()

  useEffect(() => {
    // sync with main if possible
    const win = window as TTAMWindow
    if (win?.ttam?.getLocale) {
      void win.ttam.getLocale().then((l) => {
        if (l && l !== lang) {
          setLang(l)
          void i18n.changeLanguage(l)
        }
      }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeLang = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const l = e.target.value
    setLang(l)
    await i18n.changeLanguage(l)
    try {
      const win = window as TTAMWindow
      if (win?.ttam?.setLocale) await win.ttam.setLocale(l)
    } catch {
      // ignore
    }
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="font-bold">TTAM</div>
        <Input placeholder={t('header.searchPlaceholder')} className="w-72" />
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <Badge>Administrador</Badge>
        <div>{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
        <select value={lang} onChange={onChangeLang} className="p-1 border rounded">
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  )
}
