import type {
  DeepPartial,
  MockFn,
  MockInstance,
  TimerControl,
  DOMMatchers,
  TimerMatchers,
  PromiseType as BasePromiseType,
  Awaited as BaseAwaited
} from './test-env'

// Basic utility types
export type ValueOf<T> = T[keyof T]
export type UnwrapArray<T> = T extends Array<infer U> ? U : T
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

// Promise utilities
export type Awaited<T> = BaseAwaited<T>
export type PromiseType<T> = BasePromiseType<T>
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any

// Function utilities
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>
export type SyncFunction<T = any> = (...args: any[]) => T
export type AnyFunction = (...args: any[]) => any

// Assertion types
export type Assertion<T = any> = {
  toBe(expected: T): void
  toEqual(expected: T): void
  toBeDefined(): void
  toBeUndefined(): void
  toBeNull(): void
  toBeTruthy(): void
  toBeFalsy(): void
  toContain(expected: any): void
  toHaveLength(length: number): void
  toMatch(pattern: RegExp | string): void
  toThrow(error?: string | RegExp | Error): void
  toBeInstanceOf(constructor: Function): void
} & DOMMatchers<void> & TimerMatchers<void>

// Test helpers
export type TestHookFunction = () => void | Promise<void>
export type TestCase<T = any> = {
  name: string
  input: T
  expected: any
  error?: any
  only?: boolean
  skip?: boolean
  timeout?: number
}

// Mock utilities
export type DeepMocked<T> = {
  [P in keyof T]: T[P] extends AnyFunction
    ? MockInstance<T[P]>
    : T[P] extends object
    ? DeepMocked<T[P]>
    : T[P]
}

export interface MockControl<T extends AnyFunction> {
  calls: Parameters<T>[]
  results: { type: 'return' | 'throw'; value: ReturnType<T> }[]
  instances: any[]
  lastCall: Parameters<T>
  invocationCallOrder: number[]
  getMockName(): string
  mockClear(): void
  mockReset(): void
  mockRestore(): void
}

export type SpyInstance<T extends AnyFunction> = T & {
  mock: MockControl<T>
}

// Timer utilities
export interface TimerAPI {
  setTimeout: typeof setTimeout
  clearTimeout: typeof clearTimeout
  setInterval: typeof setInterval
  clearInterval: typeof clearInterval
  Date: typeof Date
}

export interface TimerConfig {
  now?: number | Date
  systemTime?: number | Date
  advanceTimeDelta?: number
  shouldAdvanceTime?: boolean
  maxTime?: number
}

// DOM test utilities
export interface DOMTestUtils {
  render: <T = any>(component: T) => { container: HTMLElement; unmount(): void }
  cleanup: () => void
  fireEvent: {
    click: (element: Element) => Promise<void>
    change: (element: Element, value: any) => Promise<void>
    submit: (element: Element) => Promise<void>
    focus: (element: Element) => Promise<void>
    blur: (element: Element) => Promise<void>
    keyDown: (element: Element, key: string) => Promise<void>
    keyUp: (element: Element, key: string) => Promise<void>
    keyPress: (element: Element, key: string) => Promise<void>
  }
}

// Test context types
export interface TestContext {
  name?: string
  meta: Record<string, any>
  skip?: boolean
  todo?: boolean
  only?: boolean
  fails?: boolean
  timers?: TimerAPI
  testPath?: string
  filepath?: string
  timeout?: number
  retries?: number
}

// Type assertion helpers
export const assertType = <T>(_value: T) => {}
export const expectType = <T>(_value: any): asserts _value is T => {}
export const assertNotType = <T>(_value: any) => {}

// Re-export base types
export type {
  DeepPartial,
  MockFn,
  TimerControl,
  MockInstance
}
