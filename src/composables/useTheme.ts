import { ref, onMounted, watch, onUnmounted } from 'vue'

const themes = [
  'orange',
  'blue',
  'green',
  'purple',
  'red',
  'dark',
  'iridescent',
  'gold',
  'diamond',
  'astronaut'
] as const

export type ThemeName = typeof themes[number]
export type ThemeColor = 'primary' | 'secondary' | 'negative' | 'dark' | 'medium' | 'light' | 'backdrop' | 'active' | 'marginal-bg' | 'marginal-text' | 'marginal-btn' | 'marginal-btn-active'

const STORAGE_KEY = 'dividis-theme'
const THEME_CHANGE_EVENT = 'dividis-theme-change'
const DEFAULT_THEME: ThemeName = 'orange'

// CSS variable mapping
const cssVarMap: Record<ThemeColor, string> = {
  primary: '--q-primary',
  secondary: '--q-secondary',
  negative: '--q-negative',
  dark: '--q-dark',
  medium: '--q-medium',
  light: '--q-light',
  backdrop: '--q-backdrop',
  active: '--q-active',
  'marginal-bg': '--q-marginal-bg',
  'marginal-text': '--q-marginal-text',
  'marginal-btn': '--q-marginal-btn',
  'marginal-btn-active': '--q-marginal-btn-active'
}

function isValidTheme(theme: string): theme is ThemeName {
  return themes.includes(theme as ThemeName)
}

// SSR-safe DOM utilities
const setDocumentTheme = (theme: ThemeName) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

const getStoredTheme = (): ThemeName | null => {
  try {
    if (typeof localStorage !== 'undefined') {
      const theme = localStorage.getItem(STORAGE_KEY)
      return theme && isValidTheme(theme) ? theme : null
    }
  } catch (error) {
    console.warn('Could not access localStorage:', error)
  }
  return null
}

const setStoredTheme = (theme: ThemeName) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  } catch (error) {
    console.warn('Could not save theme to localStorage:', error)
  }
}

const getThemeColor = (colorName: ThemeColor): string => {
  if (typeof document === 'undefined') return ''

  const styles = getComputedStyle(document.documentElement)
  const varName = cssVarMap[colorName]
  return styles.getPropertyValue(varName).trim() || ''
}

// For testing purposes
let testMode = false
let testTheme: ThemeName | null = null

export function setTestMode(enabled: boolean, theme?: ThemeName) {
  testMode = enabled
  testTheme = theme || null
}

export function useTheme() {
  const currentTheme = ref<ThemeName>(DEFAULT_THEME)
  const isLoaded = ref(false)

  // Sync themes across tabs
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue && isValidTheme(event.newValue)) {
      currentTheme.value = event.newValue
      setDocumentTheme(event.newValue)
    }
  }

  const broadcastThemeChange = (theme: ThemeName) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
    }
  }

  const setTheme = (theme: ThemeName) => {
    if (!isValidTheme(theme)) {
      console.warn(`Invalid theme: ${theme}. Using default theme instead.`)
      theme = DEFAULT_THEME
    }

    currentTheme.value = theme
    setDocumentTheme(theme)
    setStoredTheme(theme)
    broadcastThemeChange(theme)
  }

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getAvailableThemes = () => [...themes]

  const getCurrentThemeColors = () => {
    if (testMode) {
      return Object.keys(cssVarMap).reduce((acc, key) => {
        acc[key as ThemeColor] = 'test-value'
        return acc
      }, {} as Record<ThemeColor, string>)
    }

    const colors = {} as Record<ThemeColor, string>
    Object.keys(cssVarMap).forEach((key) => {
      colors[key as ThemeColor] = getThemeColor(key as ThemeColor)
    })
    return colors
  }

  const loadTheme = () => {
    if (testMode && testTheme) {
      setTheme(testTheme)
    } else {
      const savedTheme = getStoredTheme()
      setTheme(savedTheme || DEFAULT_THEME)
    }
    isLoaded.value = true
  }

  onMounted(() => {
    if (!isLoaded.value) {
      loadTheme()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange)
    }
  })

  watch(currentTheme, (newTheme) => {
    setDocumentTheme(newTheme)
  })

  return {
    // State
    currentTheme,
    isLoaded,

    // Methods
    setTheme,
    toggleTheme,
    getAvailableThemes,
    getCurrentThemeColors,
    getThemeColor,

    // Constants
    DEFAULT_THEME,
    themes: [...themes] as const
  }
}
