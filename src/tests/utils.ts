import { type ComponentPublicInstance, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'
import { vi } from 'vitest'

// Types
export type TestValue = string | number | boolean | null | undefined
export type TestCallback = () => void | Promise<void>
export type TestPredicate<T = any> = (value: T) => boolean
export type TestData = Record<string, any>

// Mock ResizeObserver implementation
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Setup global window properties for each test
export const setupTestEnvironment = () => {
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(true)
    }))
  })

  Object.defineProperty(global, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver
  })

  Object.defineProperty(global, 'localStorage', {
    writable: true,
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  Object.defineProperty(global, 'sessionStorage', {
    writable: true,
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })
}

// Clean up after each test
export const cleanupTest = () => {
  vi.resetAllMocks()
  localStorage.clear()
  sessionStorage.clear()
}

// Wait utilities
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export const waitFor = async (
  callback: () => boolean | Promise<boolean>,
  { timeout = 1000, interval = 50 } = {}
) => {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await callback()) return true
    await wait(interval)
  }

  throw new Error('Timeout waiting for condition')
}

// Assertion helpers
export const assertSuccess = (result: unknown) => {
  expect(result).toBeDefined()
  expect((result as any).error).toBeUndefined()
}

export const assertError = (error: unknown, message?: string) => {
  expect(error).toBeDefined()
  if (message && error instanceof Error) {
    expect(error.message).toContain(message)
  }
}

export const assertDate = (date: Date) => {
  expect(date).toBeInstanceOf(Date)
  expect(date.getTime()).not.toBeNaN()
}

export const assertProperties = <T extends Record<PropertyKey, unknown>>(
  obj: T,
  properties: Array<keyof T>
) => {
  properties.forEach(prop => {
    expect(obj).toHaveProperty(String(prop))
  })
}

export const assertContains = <T>(container: T[], item: T) => {
  expect(container).toContain(item)
}

// Mock helpers
export const mockAsync = <T>(value: T) => vi.fn().mockResolvedValue(value)
export const mockError = (message: string) => vi.fn().mockRejectedValue(new Error(message))

// Component testing types
export interface MountOptions<Props = Record<string, any>> {
  props?: Props
  slots?: Record<string, unknown>
  global?: {
    plugins?: any[]
    components?: Record<string, any>
    directives?: Record<string, any>
    mocks?: Record<string, any>
    provide?: Record<string, any>
    stubs?: Record<string, any>
  }
}

export interface TestApi<T> {
  props: T
  emitted: () => Record<string, any[]>
  html: () => string
  find: (selector: string) => { exists: () => boolean }
  findAll: (selector: string) => { length: number }
  trigger: (event: string) => Promise<void>
  unmount: () => void
}
