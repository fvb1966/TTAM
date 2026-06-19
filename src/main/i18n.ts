import i18n from 'i18next'
import resources from '../i18n/resources'

i18n.init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
