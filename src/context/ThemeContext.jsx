import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const THEMES = [
  { id: 'botanical', label: 'Ботаника', colors: ['#6B7F5E', '#C4A265', '#F5F1EA'] },
  { id: 'amber', label: 'Янтарь', colors: ['#C2703E', '#D4A03C', '#FFF5E6'] },
  { id: 'mystical', label: 'Мистика', colors: ['#7B5EA7', '#B088C4', '#F3EEF8'] },
]

const STORAGE_KEY = 'vedmino-theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'mystical'
    } catch {
      return 'mystical'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch { /* noop */ }
  }, [theme])

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      const idx = THEMES.findIndex(t => t.id === prev)
      return THEMES[(idx + 1) % THEMES.length].id
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
