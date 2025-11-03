import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { defaultLocale, type Locale, locales } from '@/i18n/config'
import enTranslations from '../../messages/en.json'
import zhTranslations from '../../messages/zh.json'

const resources = {
  en: {
    translation: enTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
}

const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  convertDetectedLanguage: (lng: string): string => {
    const normalized = lng.toLowerCase().split('-')[0]

    if (normalized === 'zh') {
      return 'zh'
    }

    if (locales.includes(normalized as Locale)) {
      return normalized
    }

    return defaultLocale
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: 'translation',
    ns: ['translation'],

    detection: languageDetectorOptions,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: false,
  })

export default i18n
