import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme, setTestMode } from '../../composables/useTheme'
import { nextTick } from 'vue'

describe('useTheme composable', () => {
  beforeEach(() => {
    // Reset test mode and localStorage before each test
    setTestMode(false)
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('should initialize with default orange theme', () => {
    const { currentTheme } = useTheme()
    expect(currentTheme.value).toBe('orange')
    expect(document.documentElement.getAttribute('data-theme')).toBe('orange')
  })

  it('should load theme from localStorage', async () => {
    localStorage.setItem('dividis-theme', 'blue')
    const { currentTheme } = useTheme()
    await nextTick()
    expect(currentTheme.value).toBe('blue')
    expect(document.documentElement.getAttribute('data-theme')).toBe('blue')
  })

  it('should toggle through themes', async () => {
    const { currentTheme, toggleTheme } = useTheme()
    expect(currentTheme.value).toBe('orange')

    toggleTheme()
    await nextTick()
    expect(currentTheme.value).toBe('blue')
    expect(document.documentElement.getAttribute('data-theme')).toBe('blue')

    toggleTheme()
    await nextTick()
    expect(currentTheme.value).toBe('green')
    expect(document.documentElement.getAttribute('data-theme')).toBe('green')
  })

  it('should handle test mode', async () => {
    setTestMode(true, 'purple')
    const { currentTheme, getCurrentThemeColors } = useTheme()

    await nextTick()
    expect(currentTheme.value).toBe('purple')
    expect(document.documentElement.getAttribute('data-theme')).toBe('purple')

    const colors = getCurrentThemeColors()
    expect(colors.primary).toBe('test-value')
  })

  it('should persist theme changes to localStorage', async () => {
    const { setTheme } = useTheme()
    setTheme('dark')
    await nextTick()

    expect(localStorage.getItem('dividis-theme')).toBe('dark')
  })

  it('should handle invalid themes', async () => {
    const { currentTheme, setTheme } = useTheme()
    // @ts-expect-error Testing invalid theme
    setTheme('invalid-theme')
    await nextTick()

    // Should fall back to default theme
    expect(currentTheme.value).toBe('orange')
    expect(document.documentElement.getAttribute('data-theme')).toBe('orange')
  })

  it('should get theme colors', () => {
    const { getCurrentThemeColors, getThemeColor } = useTheme()

    const colors = getCurrentThemeColors()
    expect(colors.primary).toBe('#test-color')
    expect(getThemeColor('primary')).toBe('#test-color')
  })
})
