import { Store } from '@tanstack/store'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeStore = {
  theme: Theme
  storageKey: string
}

let themeStore: Store<ThemeStore> | null = null

const createThemeStore = (
  defaultTheme: Theme,
  storageKey: string,
): Store<ThemeStore> => {
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
      return defaultTheme
    }
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (
        stored &&
        (stored === 'dark' || stored === 'light' || stored === 'system')
      ) {
        return stored
      }
    } catch {
      return defaultTheme
    }
    return defaultTheme
  }

  return new Store<ThemeStore>({
    theme: getInitialTheme(),
    storageKey,
  })
}

export function initThemeStore(
  defaultTheme: Theme = 'system',
  storageKey: string = 'vite-ui-theme',
): Store<ThemeStore> {
  if (!themeStore) {
    themeStore = createThemeStore(defaultTheme, storageKey)
  }
  return themeStore
}

export function getThemeStore(): Store<ThemeStore> {
  if (!themeStore) {
    throw new Error('Theme store is not initialized. Use ThemeProvider first.')
  }
  return themeStore
}
