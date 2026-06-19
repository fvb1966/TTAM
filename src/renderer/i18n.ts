import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resources from '../i18n/resources'

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

// Sync initial locale with localStorage or main process if available
;(async () => {
  try {
    const win = window as Window & { ttam?: { setLocale?: (l: string) => Promise<string | null>; getLocale?: () => Promise<string> } }
    const stored = localStorage.getItem('ttam:locale')
    if (stored) {
      await i18n.changeLanguage(stored)
      if (win?.ttam?.setLocale) await win.ttam.setLocale(stored)
    } else if (win?.ttam?.getLocale) {
      const locale = await win.ttam.getLocale()
      if (locale) await i18n.changeLanguage(locale)
    }
  } catch {
    // ignore
  }
})()

// Persist changes to localStorage and notify main process
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('ttam:locale', lng)
    const win = window as Window & { ttam?: { setLocale?: (l: string) => Promise<string | null> } }
    if (win?.ttam?.setLocale) void win.ttam.setLocale(lng)
  } catch {
    // ignore
  }
})

export default i18n
