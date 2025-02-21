/**
 * Custom error classes for testing utilities
 */

/**
 * Thrown when an operation times out
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Thrown when an assertion fails
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssertionError'
  }
}
