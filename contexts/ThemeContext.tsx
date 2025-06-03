// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ColorSchemeName, useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = 'user-theme'

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme: ColorSchemeName = useColorScheme() // 'light' | 'dark' | null
  const [theme, setTheme] = useState<Theme>(
    systemScheme === 'dark' ? 'dark' : 'light'
  )
  const [isLoading, setIsLoading] = useState(true)

  // On mount, read stored preference (if any)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') {
          setTheme(stored)
        } else if (systemScheme) {
          setTheme(systemScheme === 'dark' ? 'dark' : 'light')
        }
      } catch {
        // ignore errors and fallback to systemScheme
        if (systemScheme) {
          setTheme(systemScheme === 'dark' ? 'dark' : 'light')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadTheme()
  }, [systemScheme])

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write errors
    }
  }

  if (isLoading) {
    // You can return a splash/loading screen here if you prefer.
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
