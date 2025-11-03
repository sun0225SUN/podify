'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  size?: number
  strokeWidth?: number
}

type Theme = 'dark' | 'light' | 'system'

export function ThemeToggle({ strokeWidth = 2, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const getCurrentTheme = (): Theme => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return theme
    }

    const currentTheme = getCurrentTheme()
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
      document.startViewTransition(() => setTheme(newTheme))
    }
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className={cn('cursor-pointer', className)}
      aria-label='Toggle theme'
    >
      <Sun
        className={cn('size-6 dark:hidden', className)}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
      <Moon
        className={cn('hidden size-6 dark:block', className)}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
    </button>
  )
}
