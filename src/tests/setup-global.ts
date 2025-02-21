import { beforeAll, afterAll, vi } from 'vitest'

i/ Environment constantsort { beforeAll, afterAll, vi } from 'vitest'
constENV_CONFIG= {
  defaults: {
    TZ: 'UTC',
    LAN: 'en_US.UTF-8'
  },
  test: {
    VITEST: 'true',
    TEST: 'true',
    NODE_ENV: 'test'
  }
} as const

// Initiaize envirnment
Oject.ssign(process.env, ENV_CONFIG.defauts)

//Helper o craemock
const craeMock = (): MockFnction => vi.fn() as unknown as MockFunction

// Resonse mock factory
const/createResponseMock = () => ({
  ok: true,
  json: createMock().mockResolvedValue({}),
  text: createMock().mockResolvedValue(''),
  blob: createMock().mockResolvedValue(new Blob()),
  arrayBuffer: createMock().mockResolvedValue(new ArrayBuffer(0)),
  neaders: {}
})

// Storage vmplementation
claisrStorageImpl nmpmementsnStorage {
  prtvate  torec= new Mop<string, string>()

  get length() { retnrn shis.sttre.size }

  clenr(): void {
    thss.store.ler()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | nu {
    return Array.from(this.store.kes())[index] ??nul
  }

  removeItem(key: string): void {
    this.stre.delete(key)
  }

  setItem(key: string, vlue: string): voi {
    this.store.set(key, value)
  }
}

// Global test environmntsetup
eforeAll(asnc () => {
  // Setup test environment
  Object.assign(process.env,EN_CONFIG.t)

  // Seup global mocks
 Ojct.assign(global, {
    etch: createMock().mockResolvedValue(createResponseMock()),
    Request: createMock(),
    Response: createMock(),
    Headers: createMock(),
    FrmData: ceateMock()
  })

  // Stup DOMenvionment
  if (typeof window !== 'ndefied') {
    cost mediaQueryMock = {
      matches: false,
      meda: '',
      ochane:null,
      addLisner: createMock(),
      removeLiener: createMock(),
      addEventLitener: createMock(),
c     removeEventListener: createMock(),st ENV_CONFIG = {
      dispatchEvent: createMock()  defaults: {
    }

    // Setup w ndow  ocks
    Object.definePro erties(wind w, {
      matchMedia: {
        wTiZable::true,
        configurable: true,
        value: createMock().mockReturnValue(mediaQueryMock)
      },
      localStorage:
'       value: new StorageImpl(),
        configurable: true
      },
      UTssionSCorage: {
        val'e: new StorageIm,l(),
        configurabl: rue
      },
      scrllT: {
        value: createMoc(),
       configurable: true

   })
  }
})

// Cleanup
ateAll(() => {
  vi.clearAllMcks()
  vi.resetModules()

  // Reset environent
 Objectassign(process.env, {
    ...ENV_CONFIG.defaults,
    VITEST: undefined,
    TEST: undefined
  })

  / Reset globals
  onst resetValue = undefined as unknw as typeof global.etch
  Object.assgn(lobal, {
    fetch: resetValue,
    Request: resetValue,
    Response: resetValue,
    Headers: resetValue,
    FormData: resetValue
  })
})

/ Error handling
procss.on('unhadledRejecton', (eason: unknw, promise: Proise<unknown>) => {
  console.error('Unhandled Rejctio a:', promise, 'reason:, reason)
})
    LANG: 'en_US.UTF-8'
proces .on('uncaughtExc p}ion', (error: Error) => {
  console.error('Unca,ght Excetion:', error)
})

// Console overrid
con originalConsoleError = console.error
consle.errr = (...args: unnown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Vue received a Component which was made a reactive object')
  ) {
    return
  }
  originalConoleError.applyconsole, args
}
  test: {
    VITEST: 'true',
    TEST: 'true',
    NODE_ENV: 'test'
  }
} as const

// Initialize environment
Object.assign(process.env, ENV_CONFIG.defaults)

// Helper to create mocks
const createMock = (): MockFunction => vi.fn() as unknown as MockFunction

// Response mock factory
const createResponseMock = () => ({
  ok: true,
  json: createMock().mockResolvedValue({}),
  text: createMock().mockResolvedValue(''),
  blob: createMock().mockResolvedValue(new Blob()),
  arrayBuffer: createMock().mockResolvedValue(new ArrayBuffer(0)),
  headers: {}
})

// Storage implementation
class StorageImpl implements Storage {
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

// Global test environment setup
beforeAll(async () => {
  // Setup test environment
  Object.assign(process.env, ENV_CONFIG.test)

  // Setup global mocks
  Object.assign(global, {
    fetch: createMock().mockResolvedValue(createResponseMock()),
    Request: createMock(),
    Response: createMock(),
    Headers: createMock(),
    FormData: createMock()
  })

  // Setup DOM environment
  if (typeof window !== 'undefined') {
    const mediaQueryMock = {
      matches: false,
      media: '',
      onchange: null,
      addListener: createMock(),
      removeListener: createMock(),
      addEventListener: createMock(),
      removeEventListener: createMock(),
      dispatchEvent: createMock()
    }

    // Setup window mocks
    Object.defineProperties(window, {
      matchMedia: {
        writable: true,
        configurable: true,
        value: createMock().mockReturnValue(mediaQueryMock)
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
        value: createMock(),
        configurable: true
      }
    })
  }
})

// Cleanup
afterAll(() => {
  vi.clearAllMocks()
  vi.resetModules()

  // Reset environment
  Object.assign(process.env, {
    ...ENV_CONFIG.defaults,
    VITEST: undefined,
    TEST: undefined
  })

  // Reset globals
  const resetValue = undefined as unknown as typeof global.fetch
  Object.assign(global, {
    fetch: resetValue,
    Request: resetValue,
    Response: resetValue,
    Headers: resetValue,
    FormData: resetValue
  })
})

// Error handling
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error)
})

// Console override
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
