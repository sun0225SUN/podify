export type Locale = 'en' | 'zh'

export const locales: Locale[] = ['en', 'zh']

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale
  }

  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';')
      const quality = parseFloat(q.replace('q=', '')) || 1
      return { code: code.toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { code } of languages) {
    if (isValidLocale(code)) {
      return code
    }
    for (const locale of locales) {
      if (code.startsWith(locale)) {
        return locale
      }
    }
  }

  return defaultLocale
}
