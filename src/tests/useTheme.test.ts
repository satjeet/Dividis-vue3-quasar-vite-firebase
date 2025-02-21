/// <reference types="vitest" />
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTheme, setTestMode } from '../composables/useTheme'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

interface MockStorage {
  [key: string]: string
}

interface MockDocument {
  [key: string]: string
}

describe('useTheme', () => {
  let mockLocalStorage: MockStorage = {}
  let mockDocument: MockDocument = {}

  beforeEach(() => {
    // Mock localStorage
    const storage: Storage = {
      getItem: vi.fn((key: string): string | null => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string): void => { mockLocalStorage[key] = value }),
      removeItem: vi.fn((key: string): void => { delete mockLocalStorage[key] }),
      clear: vi.fn((): void => { mockLocalStorage = {} }),
      length: 0,
      key: vi.fn((_index: number): string | null => null),
    }
    global.localStorage = storage

    // Mock document
    const documentMock = {
      documentElement: {
        setAttribute: vi.fn((key: string, value: string): void => { mockDocument[key] = value }),
        getAttribute: vi.fn((key: string): string | null => mockDocument[key] || null),
        style: {
          getPropertyValue: vi.fn((): string => 'test-color')
        }
      }
    }
    global.document = documentMock as unknown as Document

    // Reset mocks and storage
    mockLocalStorage = {}
    mockDocument = {}
    setTestMode(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default theme', () => {
    const TestComponent = defineComponent({
      setup() {
        const { currentTheme } = useTheme()
        return { currentTheme }
      },
      template: '<div>{{ currentTheme }}</div>'
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toBe('orange')
  })

  it('should load theme from localStorage', async () => {
    mockLocalStorage['dividis-theme'] = 'blue'

    const TestComponent = defineComponent({
      setup() {
        const { currentTheme } = useTheme()
        return { currentTheme }
      },
      template: '<div>{{ currentTheme }}</div>'
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toBe('blue')
  })

  it('should toggle through themes', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { currentTheme, toggleTheme } = useTheme()
        return { currentTheme, toggleTheme }
      },
      template: '<button @click="toggleTheme">{{ currentTheme }}</button>'
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toBe('orange')

    await wrapper.trigger('click')
    expect(wrapper.text()).toBe('blue')

    await wrapper.trigger('click')
    expect(wrapper.text()).toBe('green')
  })

  it('should get theme colors', () => {
    const { getCurrentThemeColors, getThemeColor } = useTheme()

    const colors = getCurrentThemeColors()
    expect(colors.primary).toBeDefined()
    expect(getThemeColor('primary')).toBe('test-color')
  })

  it('should handle test mode', () => {
    setTestMode(true, 'purple')
    const { currentTheme, getCurrentThemeColors } = useTheme()

    expect(currentTheme.value).toBe('purple')
    const colors = getCurrentThemeColors()
    expect(colors.primary).toBe('test-value')
  })

  it('should validate themes', () => {
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { setTheme, currentTheme } = useTheme()

    // @ts-expect-error Testing invalid theme
    setTheme('invalid-theme')
    expect(consoleWarnMock).toHaveBeenCalled()
    expect(currentTheme.value).toBe('orange')

    setTheme('dark')
    expect(currentTheme.value).toBe('dark')
  })

  it('should sync across tabs', () => {
    const { currentTheme } = useTheme()
    expect(currentTheme.value).toBe('orange')

    // Simulate storage event from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'dividis-theme',
      newValue: 'dark'
    })
    window.dispatchEvent(storageEvent)

    expect(currentTheme.value).toBe('dark')
    expect(mockDocument['data-theme']).toBe('dark')
  })
})
