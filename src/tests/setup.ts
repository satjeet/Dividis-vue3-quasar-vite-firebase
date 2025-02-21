declare const beforeAll: (fn: () => void) => void
declare const afterAll: (fn: () => void) => void
declare const beforeEach: (fn: () => void) => void
declare const afterEach: (fn: () => void) => void

// Custom matchers
type CustomMatcherResult = { pass: boolean; message: () => string }

const matchers = {
  toHaveLength(received: any, length: number): CustomMatcherResult {
    const pass = received.length === length
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have length ${length}`
    }
  },
  toBeInTheDocument(received: Element): CustomMatcherResult {
    const pass = document.body.contains(received)
    return {
      pass,
      message: () => `expected element to${pass ? ' not' : ''} be in the document`
    }
  }
}

// DOM cleanup utility
const cleanup = () => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = ''
  }
}

// Timer utilities
let originalDateNow = Date.now
let mockNow = 0

const timerUtils = {
  useFakeTimers(): void {
    mockNow = Date.now()
    Date.now = () => mockNow
  },
  useRealTimers(): void {
    Date.now = originalDateNow
  },
  advanceTimersByTime(ms: number): void {
    mockNow += ms
  },
  runAllTimers(): void {
    // Implement if needed
  },
  clearAllTimers(): void {
    mockNow = Date.now()
  }
}

// Mock utilities
const mockUtils = {
  mockFunctions: new Map<string, Function>(),
  mockImplementations: new Map<string, Function>(),

  fn<T extends Function>(implementation?: T): T {
    const mockFn = (...args: any[]) => {
      const impl = mockUtils.mockImplementations.get(mockFn.name) || implementation
      return impl?.(...args)
    }
    mockUtils.mockFunctions.set(mockFn.name, mockFn)
    return mockFn as unknown as T
  },

  clearAllMocks(): void {
    mockUtils.mockFunctions.clear()
    mockUtils.mockImplementations.clear()
  }
}

// Register hooks
function setupHooks(): void {
  beforeAll(() => {
    timerUtils.useFakeTimers()
  })

  afterAll(() => {
    timerUtils.useRealTimers()
  })

  beforeEach(() => {
    mockUtils.clearAllMocks()
    timerUtils.clearAllTimers()
  })

  afterEach(() => {
    cleanup()
  })
}

// Setup globals
const globals = {
  expect: {
    extend: (newMatchers: Record<string, Function>) => {
      Object.assign(matchers, newMatchers)
    },
    ...matchers
  },
  vi: {
    ...mockUtils,
    ...timerUtils
  }
}

// Setup environment
const env = {
  VITE_APP_TITLE: 'Test App',
  MODE: 'test',
  DEV: 'true',
  PROD: 'false',
  SSR: 'false'
}

Object.assign(globalThis, globals)
Object.assign(process.env, env)

setupHooks()

export { matchers, mockUtils, timerUtils, cleanup }
