/**
 * Test Configuration and Utilities
 * @module test/config
 */

import { describe, it } from 'vitest'
import { delay } from '../utils/test-helpers'
import type { Mock } from './types'

export * from './environment'
export * from './mocks'
export * from './storage'
export * from './types'
export { TimeoutError, AssertionError } from '../utils/errors'
export {
  TestAssertions,
  createEvent,
  createDeferred,
  createMock,
  delay as waitDelay,
  waitFor
} from '../utils/test-helpers'

// Re-export common types
export type {
  TypeGuard,
  AsyncOperation,
  Condition,
  WaitForOptions,
  Deferred,
  EventMock
} from '../types/test-types'

// Test configuration types
export interface TestConfig {
  timeout: number
  interval: number
  retries: number
  verbose: boolean
}

/**
 * Default test configuration
 */
export const defaultConfig: TestConfig = {
  timeout: 5000,
  interval: 50,
  retries: 3,
  verbose: false
}

/**
 * Common test patterns and utilities
 *
 * @example
 * ```ts
 * import { TestAssertions, createMock, delay } from '@test/config'
 *
 * describe('Component', () => {
 *   it('works', async () => {
 *     const mock = createMock()
 *     await TestAssertions.assertCompletes(async () => {
 *       await delay(100)
 *       mock('test')
 *     })
 *     TestAssertions.assertMockCalls(mock, ['test'])
 *   })
 * })
 * ```
 */

/**
 * Test wrapper function type
 */
export type TestFunction = () => Promise<void>

/**
 * Test suite definition type
 */
export type TestSuite = Record<string, TestFunction>

/**
 * Initializes test environment with custom config
 */
export const initTestEnv = (config: Partial<TestConfig> = {}) => {
  const env: TestConfig = { ...defaultConfig, ...config }

  return {
    /**
     * Creates a test wrapper with common setup/teardown
     */
    createTest: (name: string, fn: TestFunction): TestFunction => {
      return async () => {
        const start = Date.now()

        try {
          await fn()
        } catch (error) {
          if (env.verbose) {
            console.error(`Test "${name}" failed:`, error)
          }
          throw error
        } finally {
          if (env.verbose) {
            const duration = Date.now() - start
            console.log(`Test "${name}" took ${duration}ms`)
          }
        }
      }
    },

    /**
     * Wraps async operations with retry logic
     */
    withRetry: async <T>(
      operation: () => Promise<T>,
      retries = env.retries
    ): Promise<T> => {
      let lastError: unknown

      for (let i = 0; i < retries; i++) {
        try {
          return await operation()
        } catch (error) {
          lastError = error
          if (env.verbose) {
            console.warn(`Retry ${i + 1}/${retries} failed:`, error)
          }
          await delay(Math.pow(2, i) * 100) // Exponential backoff
        }
      }

      throw lastError
    },

    /**
     * Creates a test suite with common configuration
     */
    createSuite: (name: string, tests: TestSuite) => {
      describe(name, () => {
        Object.entries(tests).forEach(([testName, test]) => {
          it(testName, createTest(testName, test))
        })
      })
    }
  }
}

// Export default test environment
export const testEnv = initTestEnv()
export const { createTest, withRetry, createSuite } = testEnv
