/**
 * @fileoverview Mock factories and utilities for testing
 * @module test/config/mocks
 */

import { vi } from 'vitest'
import type { Mock } from './types'

/**
 * Creates a Vitest mock function with enhanced type safety
 *
 * @template T - Type of the mock function (optional)
 * @returns {Mock} A mock function with Vitest's mock utilities
 *
 * @example
 * ```ts
 * const myMock = mockFactory<(name: string) => number>()
 * myMock.mockReturnValue(42)
 * ```
 */
export const mockFactory = <T = any>(): Mock => vi.fn() as unknown as Mock

/**
 * Creates a mock Response object for testing fetch calls
 *
 * @returns {Object} A mock Response-like object
 *
 * @example
 * ```ts
 * const response = createResponseMock()
 * const data = await response.json() // {}
 * console.log(response.ok) // true
 * ```
 */
export const createResponseMock = () => ({
  ok: true,
  json: mockFactory().mockResolvedValue({}),
  text: mockFactory().mockResolvedValue(''),
  blob: mockFactory().mockResolvedValue(new Blob()),
  arrayBuffer: mockFactory().mockResolvedValue(new ArrayBuffer(0)),
  headers: {}
})

/**
 * Creates a mock MediaQueryList object for testing window.matchMedia
 *
 * @returns {Object} A mock MediaQueryList-like object
 *
 * @example
 * ```ts
 * const mediaQuery = createMediaQueryMock()
 * console.log(mediaQuery.matches) // false
 * mediaQuery.addEventListener('change', () => {})
 * ```
 */
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

/**
 * Creates a mock window object with common properties
 *
 * @returns {Object} A partial Window-like object with mocked methods
 *
 * @example
 * ```ts
 * const windowMock = createWindowMock()
 * windowMock.matchMedia('(prefers-color-scheme: dark)')
 * windowMock.localStorage.setItem('key', 'value')
 * ```
 */
export const createWindowMock = () => ({
  matchMedia: mockFactory().mockReturnValue(createMediaQueryMock()),
  localStorage: {},
  sessionStorage: {},
  scrollTo: mockFactory(),
  addEventListener: mockFactory(),
  removeEventListener: mockFactory(),
  dispatchEvent: mockFactory()
})

/**
 * Creates common global mocks used in most tests
 *
 * @returns {Object} Common global mock objects
 *
 * @example
 * ```ts
 * const globals = createGlobalMocks()
 * Object.assign(global, globals)
 * ```
 */
export const createGlobalMocks = () => ({
  fetch: mockFactory().mockResolvedValue(createResponseMock()),
  Request: mockFactory(),
  Response: mockFactory(),
  Headers: mockFactory(),
  FormData: mockFactory()
})

/**
 * Creates mock event handlers
 *
 * @returns {Object} Common event handler mocks
 *
 * @example
 * ```ts
 * const handlers = createEventHandlerMock()
 * element.addEventListener = handlers.addEventListener
 * ```
 */
export const createEventHandlerMock = () => ({
  addEventListener: mockFactory(),
  removeEventListener: mockFactory(),
  dispatchEvent: mockFactory()
})

/**
 * Creates a mock error handler
 *
 * @returns {Object} Error handler mock functions
 *
 * @example
 * ```ts
 * const errorHandler = createErrorHandlerMock()
 * service.onError = errorHandler.handleError
 * ```
 */
export const createErrorHandlerMock = () => ({
  handleError: mockFactory(),
  reportError: mockFactory()
})

/**
 * Creates a promise mock with predefined value
 *
 * @template T - Type of the resolved value
 * @param {T} value - Value to resolve with
 * @returns {Object} Promise mock utilities
 *
 * @example
 * ```ts
 * const promiseMock = createPromiseMock('data')
 * await promiseMock.promise // 'data'
 * ```
 */
export const createPromiseMock = <T>(value: T) => ({
  promise: Promise.resolve(value),
  resolve: mockFactory(),
  reject: mockFactory()
})

/**
 * Creates a controllable async mock
 *
 * @template T - Type of the resolved value
 * @returns {Object} Async mock with control methods
 *
 * @example
 * ```ts
 * const asyncMock = createAsyncMock<string>()
 * const promise = asyncMock.mock()
 * asyncMock.resolve('data')
 * const result = await promise // 'data'
 * ```
 */
export const createAsyncMock = <T>() => {
  let resolver: (value: T) => void
  let rejector: (reason: any) => void

  const promise = new Promise<T>((resolve, reject) => {
    resolver = resolve
    rejector = reject
  })

  return {
    promise,
    resolve: (value: T) => resolver(value),
    reject: (reason: any) => rejector(reason),
    mock: mockFactory().mockImplementation(() => promise)
  }
}
