/// <reference types="vite/client" />

// Mock function type
type MockFn<T extends Function = Function> = T & {
  mock: { calls: any[][] }
  mockClear(): void
  mockReset(): void
  mockImplementation(fn: T): MockFn<T>
  mockReturnValue(value: any): MockFn<T>
  mockResolvedValue(value: any): MockFn<T>
  mockRejectedValue(error: any): MockFn<T>
}

// Test utilities
interface TestUtils {
  dom: {
    findByTestId(wrapper: any, id: string): any
    findAllByTestId(wrapper: any, id: string): any[]
    exists(wrapper: any): boolean
    text(wrapper: any): string
    click(wrapper: any): Promise<void>
    type(wrapper: any, value: string): Promise<void>
  }
  timing: {
    wait(ms: number): Promise<void>
    nextTick(): Promise<void>
    until<T>(predicate: () => T | null | undefined): Promise<NonNullable<T>>
  }
  mock: {
    fn: <T extends Function>(implementation?: T) => MockFn<T>
    clearAll(): void
  }
}

// Custom matchers interface
interface CustomMatchers<R = void> {
  toBeVisible(): R
  toHaveClass(className: string): R
  toHaveText(text: string): R
  toHaveAttribute(name: string, value?: string): R
}

// Test context
interface TestContext {
  task: { name: string }
  utils: TestUtils
  cleanup: (fn: () => Promise<void> | void) => void
}

// Declare Vitest module
declare module 'vitest' {
  export { TestContext }

  export const beforeAll: (fn: () => void | Promise<void>) => void
  export const afterAll: (fn: () => void | Promise<void>) => void
  export const beforeEach: (fn: (context: TestContext) => void | Promise<void>) => void
  export const afterEach: (fn: (context: TestContext) => void | Promise<void>) => void
  export const describe: (name: string, fn: () => void) => void
  export const it: (name: string, fn: (context: TestContext) => Promise<void> | void) => void
  export const test: typeof it

  interface Assertion extends CustomMatchers {}

  export const expect: {
    <T = any>(actual: T): Assertion & {
      toBe(expected: any): void
      toEqual(expected: any): void
      toBeDefined(): void
      toBeUndefined(): void
      toBeTruthy(): void
      toBeFalsy(): void
      toContain(expected: any): void
      toHaveLength(length: number): void
      toHaveBeenCalled(): void
      toHaveBeenCalledTimes(times: number): void
      toHaveBeenCalledWith(...args: any[]): void
      not: Assertion
    }
    extend(matchers: Record<string, any>): void
  }

  export const vi: {
    fn: <T extends Function>(implementation?: T) => MockFn<T>
    spyOn(object: any, method: string): MockFn
    mock: (path: string) => any
    clearAllMocks: () => void
    resetModules: () => void
    useFakeTimers: () => void
    useRealTimers: () => void
    runAllTimers: () => void
    setSystemTime: (time: Date | number | string) => void
  }
}

// Global augmentations
declare global {
  const describe: typeof import('vitest').describe
  const it: typeof import('vitest').it
  const test: typeof import('vitest').test
  const expect: typeof import('vitest').expect
  const vi: typeof import('vitest').vi
  const beforeAll: typeof import('vitest').beforeAll
  const afterAll: typeof import('vitest').afterAll
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
}

// Exports
export type { TestContext, TestUtils, MockFn, CustomMatchers }
