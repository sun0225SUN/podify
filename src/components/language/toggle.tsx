'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Locale } from '~/i18n/config'
import { setUserLocale } from '~/service/locale'

export function LanguageToggle() {
  const t = useTranslations('Language')
  const locale = useLocale()
  const [, startTransition] = useTransition()

  const handleLocaleChange = (value: string) => {
    const locale = value as Locale
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <Select onValueChange={handleLocaleChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={t(locale)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          className='cursor-pointer'
          value='en'
        >
          {t('en')}
        </SelectItem>
        <SelectItem
          className='cursor-pointer'
          value='zh'
        >
          {t('zh')}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
