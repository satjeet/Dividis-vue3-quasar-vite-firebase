/**
 * @fileoverview Test environment configuration and setup utilities
 * @module test/config/environment
 */

import { beforeAll, afterAll, vi } from 'vitest'
import { StorageImpl } from './storage'
import { createGlobalMocks, createMediaQueryMock, mockFactory } from './mocks'

/**
 * Environment configuration default values and test settings
 */
export const ENV = {
  /** Default environment settings */
  defaults: {
    /** Timezone setting */
    TZ: 'UTC',
    /** Language/locale setting */
    LANG: 'en_US.UTF-8'
  },
  /** Test-specific environment settings */
  test: {
    /** Vitest environment flag */
    VITEST: 'true',
    /** Test environment flag */
    TEST: 'true',
    /** Node environment setting */
    NODE_ENV: 'test'
  }
} as const

/**
 * Sets up console error filtering for cleaner test output
 *
 * @returns {Function} Cleanup function to restore original console.error
 *
 * @example
 * ```ts
 * const cleanup = setupConsoleOverride()
 * // ... run tests ...
 * cleanup() // restore original console.error
 * ```
 */
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
  return () => {
    console.error = originalConsoleError
  }
}

/**
 * Sets up global error handlers for tests
 *
 * @returns {Function} Cleanup function to remove error handlers
 *
 * @example
 * ```ts
 * const cleanup = setupErrorHandlers()
 * // ... run tests ...
 * cleanup() // remove error handlers
 * ```
 */
export const setupErrorHandlers = () => {
  const handlers: Array<() => void> = []

  const unhandledRejection = (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  }

  const uncaughtException = (error: Error) => {
    console.error('Uncaught Exception:', error)
  }

  process.on('unhandledRejection', unhandledRejection)
  process.on('uncaughtException', uncaughtException)

  handlers.push(() => {
    process.removeListener('unhandledRejection', unhandledRejection)
    process.removeListener('uncaughtException', uncaughtException)
  })

  return () => handlers.forEach(cleanup => cleanup())
}

/**
 * Sets up DOM environment for tests
 *
 * @returns {Function} Cleanup function to reset DOM environment
 *
 * @example
 * ```ts
 * const cleanup = setupDOMEnvironment()
 * // ... run tests ...
 * cleanup() // reset DOM environment
 * ```
 */
export const setupDOMEnvironment = () => {
  if (typeof window === 'undefined') return () => {}

  // Setup window mocks
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

  return () => {
    // Reset window properties
    Object.defineProperties(window, {
      matchMedia: { value: undefined, configurable: true },
      localStorage: { value: undefined, configurable: true },
      sessionStorage: { value: undefined, configurable: true },
      scrollTo: { value: undefined, configurable: true }
    })
  }
}

/**
 * Sets up the global test environment
 *
 * @returns {Function} Cleanup function to reset environment
 *
 * @example
 * ```ts
 * const cleanup = setupEnvironment()
 * // ... run tests ...
 * cleanup() // reset environment
 * ```
 */
export const setupEnvironment = () => {
  const cleanups: Array<() => void> = []

  // Initialize environment
  Object.assign(process.env, ENV.defaults)
  cleanups.push(() => {
    Object.assign(process.env, {
      ...ENV.defaults,
      VITEST: undefined,
      TEST: undefined
    })
  })

  // Setup console override
  cleanups.push(setupConsoleOverride())

  // Setup error handlers
  cleanups.push(setupErrorHandlers())

  // Setup DOM environment
  cleanups.push(setupDOMEnvironment())

  return () => cleanups.forEach(cleanup => cleanup())
}

/**
 * Sets up all test hooks for Vitest
 * Must be called in the test setup file
 *
 * @example
 * ```ts
 * // In setup-global.ts
 * import { setupTestHooks } from './config/environment'
 * setupTestHooks()
 * ```
 */
export const setupTestHooks = () => {
  let cleanup: () => void

  beforeAll(async () => {
    Object.assign(process.env, ENV.test)
    Object.assign(global, createGlobalMocks())
    cleanup = setupEnvironment()
  })

  afterAll(() => {
    vi.clearAllMocks()
    vi.resetModules()
    cleanup?.()
  })
}

// Initialize environment
Object.assign(process.env, ENV.defaults)
