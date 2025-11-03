import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/language/toggle'
import { ThemeToggle } from '@/components/theme/toggle'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { t } = useTranslation()

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-10'>
      <ThemeToggle />
      <LanguageToggle />
      <div className='text-center'>
        <h1 className='font-bold text-4xl'>
          {t('common.hello')} {t('common.world')}
        </h1>
      </div>
    </div>
  )
}
