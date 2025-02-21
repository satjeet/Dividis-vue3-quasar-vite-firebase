import { expect } from 'vitest'
import type { Result } from '../types/errors'
import { isResult } from '../types/errors'

/**
 * Types for test assertions
 */
export type Mock<T = any> = {
  calls: T[][]
  mockReturnValue: (value: any) => Mock<T>
  mockResolvedValue: (value: any) => Mock<T>
  mockRejectedValue: (error: any) => Mock<T>
  mockImplementation: (fn: (...args: any[]) => any) => Mock<T>
}

/**
 * Checks if a result is successful and has the expected data
 */
export function expectSuccess<T>(result: Result<T>, expected?: T): void {
  expect(isResult(result)).toBe(true)
  expect(result.success).toBe(true)
  expect(result.error).toBeUndefined()

  if (expected !== undefined) {
    expect(result.data).toEqual(expected)
  } else {
    expect(result.data).toBeDefined()
  }
}

/**
 * Checks if a result is a failure with the expected error
 */
export function expectError<T>(result: Result<T>, message?: string): void {
  expect(isResult(result)).toBe(true)
  expect(result.success).toBe(false)
  expect(result.data).toBeUndefined()
  expect(result.error).toBeDefined()

  if (message) {
    expect(result.error?.message).toBe(message)
  }
}

/**
 * Checks if a mock function was called with the expected arguments
 */
export function expectCalled(mock: Mock, args?: any[]): void {
  expect(mock).toHaveBeenCalled()
  if (args) {
    expect(mock).toHaveBeenCalledWith(...args)
  }
}

/**
 * Checks if a mock function was called the expected number of times
 */
export function expectCalledTimes(mock: Mock, times: number): void {
  expect(mock).toHaveBeenCalledTimes(times)
}

/**
 * Checks if a mock function was not called
 */
export function expectNotCalled(mock: Mock): void {
  expect(mock).not.toHaveBeenCalled()
}

/**
 * Checks if a value has the expected keys
 */
export function expectKeys<T extends object>(obj: T, keys: Array<keyof T>): void {
  const objKeys = Object.keys(obj)
  keys.forEach(key => {
    expect(objKeys).toContain(key as string)
  })
}

/**
 * Checks if a value is a date within the expected range
 */
export function expectDateInRange(date: Date | string | number, range: { min?: Date; max?: Date } = {}): void {
  const timestamp = new Date(date).getTime()

  if (range.min) {
    expect(timestamp).toBeGreaterThanOrEqual(range.min.getTime())
  }

  if (range.max) {
    expect(timestamp).toBeLessThanOrEqual(range.max.getTime())
  }
}

/**
 * Checks if a promise rejects with the expected error
 */
export async function expectRejects(promise: Promise<any>, error?: string | RegExp | Error): Promise<void> {
  await expect(promise).rejects.toThrow(error)
}

/**
 * Checks if an error is an instance of the expected class
 */
export function expectErrorInstance<T extends Error>(error: unknown, ErrorClass: new (...args: any[]) => T): void {
  expect(error).toBeInstanceOf(ErrorClass)
}

// Re-export test constants
export { Constants } from './constants'
