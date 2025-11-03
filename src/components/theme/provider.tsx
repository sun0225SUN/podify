import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { getThemeStore, initThemeStore, type Theme } from '@/stores/theme-store'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const themeStore = initThemeStore(defaultTheme, storageKey)

  const theme = useStore(themeStore, (state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        root.classList.remove('light', 'dark')
        root.classList.add(mediaQuery.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export const useTheme = () => {
  const themeStore = getThemeStore()
  const theme = useStore(themeStore, (state) => state.theme)

  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      try {
        const currentStorageKey = themeStore.state.storageKey
        localStorage.setItem(currentStorageKey, newTheme)
      } catch (error) {
        console.error('Error setting theme:', error)
      }
    }

    themeStore.setState((state) => ({
      ...state,
      theme: newTheme,
    }))
  }

  return {
    theme,
    setTheme,
  }
}
