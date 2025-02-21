import { expect, vi } from 'vitest'
import type { Mock } from '../config/types'
import type {
  TypeGuard,
  AsyncOperation,
  Condition,
  WaitForOptions,
  Deferred,
  EventMock
} from '../types/test-types'
import { TimeoutError, AssertionError } from './errors'

/**
 * Type-safe assertion helpers for testing
 */
export class TestAssertions {
  /**
   * Asserts that a value is a valid error with the expected message
   */
  static assertError(error: unknown, message: string): asserts error is Error {
    expect(error).toBeInstanceOf(Error)
    expect(error instanceof Error && error.message).toBe(message)
  }

  /**
   * Asserts that a mock was called with specific arguments
   */
  static assertMockCalls<T extends any[]>(mock: Mock, args: T): void {
    expect(mock.mock.calls.length).toBeGreaterThan(0)
    expect(mock.mock.calls[0]).toEqual(args)
  }

  /**
   * Asserts that an async operation completes within a timeout
   */
  static async assertCompletes(
    operation: AsyncOperation<unknown>,
    { timeout = 1000, message = 'Operation timed out' }: WaitForOptions = {}
  ): Promise<void> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new TimeoutError(message)), timeout)
      )

      await Promise.race([operation(), timeoutPromise])
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error
      }
      throw new AssertionError('Operation failed: ' + String(error))
    }
  }

  /**
   * Asserts that an object has all required properties
   */
  static assertProperties(obj: unknown, properties: string[]): void {
    expect(obj).toBeDefined()
    expect(obj).not.toBeNull()

    properties.forEach(prop => {
      expect(obj).toHaveProperty(prop)
    })
  }

  /**
   * Asserts that a value matches a type guard
   */
  static assertType<T>(
    value: unknown,
    guard: TypeGuard<T>,
    message = 'Value does not match type guard'
  ): asserts value is T {
    if (!guard(value)) {
      throw new AssertionError(message)
    }
  }

  /**
   * Asserts async operations resolve in sequence
   */
  static async assertSequential<T>(
    operations: Array<AsyncOperation<T>>
  ): Promise<T[]> {
    const results: T[] = []
    for (const op of operations) {
      results.push(await op())
    }
    return results
  }

  /**
   * Asserts that a function throws an expected error
   */
  static async assertThrows(
    fn: () => unknown,
    errorType: new (...args: any[]) => Error,
    message?: string
  ): Promise<void> {
    let error: unknown
    try {
      await fn()
      throw new AssertionError('Function did not throw as expected')
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(errorType)
    if (message) {
      expect(error instanceof Error && error.message).toBe(message)
    }
  }

  /**
   * Asserts that a value matches a pattern
   */
  static assertMatches<T>(value: T, pattern: Partial<T>): void {
    Object.entries(pattern).forEach(([key, expected]) => {
      expect(value).toHaveProperty(key)
      expect((value as any)[key]).toEqual(expected)
    })
  }
}

/**
 * Creates a promise that resolves after a delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Creates a mock event object
 */
export const createEvent = <T extends string>(
  type: T,
  props: Record<string, any> = {}
): EventMock<T> => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  ...props
})

/**
 * Waits for a condition to be true
 */
export const waitFor = async (
  condition: Condition,
  { timeout = 1000, interval = 50, message = 'Condition not met within timeout' }: WaitForOptions = {}
): Promise<void> => {
  const start = Date.now()

  while (Date.now() - start < timeout) {
    if (await condition()) return
    await delay(interval)
  }

  throw new TimeoutError(message)
}

/**
 * Creates a deferred promise
 */
export const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

/**
 * Type-safe mock creator
 */
export const createMock = <T extends (...args: any[]) => any>(): Mock => {
  const mock = vi.fn() as Mock
  return mock
}
