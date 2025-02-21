/**
 * @fileoverview Core type definitions for test configuration and mocking utilities
 * @module test/config/types
 */

/**
 * Mock function interface extending Vitest's mock capabilities
 * Provides type-safe mocking utilities with method chaining
 *
 * @example
 * ```ts
 * const myMock = mockFactory()
 * myMock.mockReturnValue('test')
 * myMock.mockImplementation(() => 'test')
 * ```
 */
export interface Mock {
  (...args: any[]): any
  mockImplementation: (fn: (...args: any[]) => any) => Mock
  mockResolvedValue: <T>(value: T) => Mock
  mockReturnValue: <T>(value: T) => Mock
  mockRejectedValue: (value: any) => Mock
  mockClear: () => void
  mockReset: () => void
  getMockName: () => string
  mock: {
    /** Array of arrays containing the arguments of each call */
    calls: any[][]
    /** Array of results for each call */
    results: { type: 'return' | 'throw'; value: any }[]
    /** Array of instances created by constructor calls */
    instances: any[]
    /** Arguments from the most recent call */
    lastCall: any[]
  }
}

/**
 * Environment configuration for test setup
 * Defines default and test-specific environment variables
 *
 * @example
 * ```ts
 * const env: Environment = {
 *   defaults: { TZ: 'UTC' },
 *   test: { NODE_ENV: 'test' }
 * }
 * ```
 */
export interface Environment {
  /** Default environment settings */
  defaults: {
    /** Timezone setting */
    TZ: string
    /** Language/locale setting */
    LANG: string
  }
  /** Test-specific environment settings */
  test: {
    /** Vitest environment flag */
    VITEST: string
    /** Test environment flag */
    TEST: string
    /** Node environment setting */
    NODE_ENV: string
  }
}

/**
 * Storage event interface for mock storage implementations
 */
export interface StorageEvent extends Event {
  /** The key being changed */
  key: string | null
  /** The old value being replaced */
  oldValue: string | null
  /** The new value being set */
  newValue: string | null
  /** The URL of the page where the change occurred */
  url: string
  /** The Storage object that was affected */
  storageArea: Storage | null
}
