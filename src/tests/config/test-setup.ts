import { beforeAll, afterAll, vi } from 'vitest'

type Mock = {
  (...args: any[]): any
  mockImplementation: (fn: (...args: any[]) => any) => Mock
  mockResolvedValue: <T>(value: T) => Mock
  mockReturnValue: <T>(value: T) => Mock
  mockRejectedValue: (value: any) => Mock
  mockClear: () => void
  mockReset: () => void
  getMockName: () => string
  mock: {
    calls: any[][]
    results: any[]
    instances: any[]
    lastCall: any[]
  }
}

// Test utilities
export const mockFactory = (): Mock => vi.fn() as unknown as Mock

// Environment configuration
export const ENV = {
  defaults: {
    TZ: 'UTC',
    LANG: 'en_US.UTF-8'
  },
  test: {
    VITEST: 'true',
    TEST: 'true',
    NODE_ENV: 'test'
  }
} as const

// Storage implementation
export class StorageImpl implements Storage {
  private store = new Map<string, string>()

  get length() { return this.store.size }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

// Response mock factory
export const createResponseMock = () => ({
  ok: true,
  json: mockFactory().mockResolvedValue({}),
  text: mockFactory().mockResolvedValue(''),
  blob: mockFactory().mockResolvedValue(new Blob()),
  arrayBuffer: mockFactory().mockResolvedValue(new ArrayBuffer(0)),
  headers: {}
})

// Media query mock factory
export const createMediaQueryMock = () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: mockFactory(),
  removeListener: mockFactory(),
  addEventListener: mockFactory(),
  removeEventListener: mockFactory(),
  dispatchEvent: mockFactory()
})

// Console override
export const setupConsoleOverride = () => {
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Vue received a Component which was made a reactive object')
    ) {
      return
    }
    originalConsoleError.apply(console, args)
  }
}

// Error handling
export const setupErrorHandlers = () => {
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  })

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error)
  })
}

// Setup hooks
export const setupHooks = () => {
  beforeAll(async () => {
    Object.assign(process.env, ENV.test)

    // Setup global mocks
    Object.assign(global, {
      fetch: mockFactory().mockResolvedValue(createResponseMock()),
      Request: mockFactory(),
      Response: mockFactory(),
      Headers: mockFactory(),
      FormData: mockFactory()
    })

    // Setup DOM environment
    if (typeof window !== 'undefined') {
      Object.defineProperties(window, {
        matchMedia: {
          writable: true,
          configurable: true,
          value: mockFactory().mockReturnValue(createMediaQueryMock())
        },
        localStorage: {
          value: new StorageImpl(),
          configurable: true
        },
        sessionStorage: {
          value: new StorageImpl(),
          configurable: true
        },
        scrollTo: {
          value: mockFactory(),
          configurable: true
        }
      })
    }

    setupConsoleOverride()
    setupErrorHandlers()
  })

  afterAll(() => {
    vi.clearAllMocks()
    vi.resetModules()

    Object.assign(process.env, {
      ...ENV.defaults,
      VITEST: undefined,
      TEST: undefined
    })

    const resetValue = undefined as any
    Object.assign(global, {
      fetch: resetValue,
      Request: resetValue,
      Response: resetValue,
      Headers: resetValue,
      FormData: resetValue
    })
  })
}

// Initialize environment
Object.assign(process.env, ENV.defaults)
