/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// Utility types
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

type PromiseType<T> = T extends Promise<infer U> ? U : T

type Awaited<T> = T extends Promise<infer U> ? U : T

// Mock function type
type MockFn<T extends (...args: any[]) => any> = T & {
  mock: {
    calls: Parameters<T>[]
    results: Array<{
      type: 'return' | 'throw'
      value: ReturnType<T>
    }>
    instances: any[]
    lastCall: Parameters<T>
    mockName: string
    mockImplementation: (fn: T) => MockFn<T>
    mockReturnValue: (value: ReturnType<T>) => MockFn<T>
    mockReset: () => void
  }
}

// DOM Matchers
interface DOMMatchers<R = unknown> {
  toHaveLength(length: number): R
  toBeInTheDocument(): R
  toHaveClass(className: string): R
  toHaveStyle(style: Record<string, any>): R
  toHaveAttribute(attr: string, value?: string): R
  toHaveTextContent(text: string | RegExp): R
  toBeVisible(): R
  toBeHidden(): R
  toBeDisabled(): R
  toBeEnabled(): R
  toBeEmpty(): R
  toBeEmptyDOMElement(): R
  toBeInvalid(): R
  toBeRequired(): R
  toBeValid(): R
  toContainElement(element: Element | null): R
  toContainHTML(html: string): R
  toHaveFocus(): R
  toHaveFormValues(values: Record<string, any>): R
  toHaveValue(value: string | string[] | number): R
  toBeChecked(): R
  toBePartiallyChecked(): R
  toHaveErrorMessage(text: string | RegExp): R
}

// Timer Matchers
interface TimerMatchers<R = unknown> {
  toHaveBeenCalledTimes(times: number): R
  toHaveBeenCalledWith(...args: any[]): R
  toHaveBeenLastCalledWith(...args: any[]): R
  toHaveBeenNthCalledWith(nth: number, ...args: any[]): R
  toBePending(): R
  toBeResolved(): R
  toBeRejected(): R
  toBeCompletedWithin(ms: number): R
}

// Timer Controls
interface TimerControl {
  advance(ms: number): void
  runAll(): void
  runPending(): void
  reset(): void
  now(): number
  setSystemTime(time: number | Date): void
}

// Mock Instance
interface MockInstance<T = any> extends MockFn<T> {
  mockClear(): MockInstance<T>
  mockReset(): MockInstance<T>
  mockRestore(): MockInstance<T>
  getMockName(): string
  mockImplementation(fn: T): MockInstance<T>
  mockImplementationOnce(fn: T): MockInstance<T>
  mockReturnValue<U extends ReturnType<T>>(value: U): MockInstance<T>
  mockReturnValueOnce<U extends ReturnType<T>>(value: U): MockInstance<T>
  mockResolvedValue<U>(value: U): MockInstance<T>
  mockRejectedValue(value: any): MockInstance<T>
}

// Vitest Module Augmentation
declare module 'vitest' {
  interface Assertion<T = any> extends DOMMatchers<T>, TimerMatchers<T> {}
  interface AsymmetricMatchersContaining extends DOMMatchers, TimerMatchers {}

  interface Vi {
    advanceTimersByTime(ms: number): void
    runAllTimers(): void
    runOnlyPendingTimers(): void
    useFakeTimers(config?: { now?: number | Date }): void
    useRealTimers(): void
    fn<T extends (...args: any[]) => any>(implementation?: T): MockInstance<T>
    spyOn<T, K extends keyof T>(obj: T, method: K): MockInstance<T[K]>
    clearAllMocks(): void
    resetAllMocks(): void
    restoreAllMocks(): void
    mockCurrentDate(date?: Date | number): void
    setSystemTime(date?: Date | number): void
    getRealSystemTime(): number
  }
}

// Global Declarations
declare global {
  interface Window {
    __TEST__: boolean
    __DEV__: boolean
    __VITEST__: boolean
  }

  namespace Vi {
    interface Assertion<T = any> extends DOMMatchers<T>, TimerMatchers<T> {}
    interface AsymmetricMatchersContaining extends DOMMatchers, TimerMatchers {}
  }

  // Test Functions
  const describe: typeof import('vitest')['describe']
  const test: typeof import('vitest')['test']
  const it: typeof import('vitest')['it']
  const expect: typeof import('vitest')['expect']
  const beforeAll: typeof import('vitest')['beforeAll']
  const afterAll: typeof import('vitest')['afterAll']
  const beforeEach: typeof import('vitest')['beforeEach']
  const afterEach: typeof import('vitest')['afterEach']

  // Mock and Timer Utilities
  const vi: typeof import('vitest')['vi']

  // Environment Constants
  const __TEST__: boolean
  const __DEV__: boolean
  const __VITEST__: boolean
}

// Exports
export {
  DeepPartial,
  MockFn,
  MockInstance,
  TimerControl,
  DOMMatchers,
  TimerMatchers,
  PromiseType,
  Awaited
}
