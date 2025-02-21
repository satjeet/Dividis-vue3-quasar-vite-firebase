/// <reference types="vite/client" />

declare module 'vitest' {
  namespace Vitest {
    interface TestContext {
      task: { name: string }
      expect: ExpectStatic
      cleanup(fn: () => Promise<void> | void): void
    }

    interface TestAPI {
      (name: string, fn: (context?: TestContext) => void | Promise<void>): void
      skip: TestAPI
      only: TestAPI
      todo: TestAPI
      concurrent: TestAPI
      sequential: TestAPI
      each: TestAPI
      fails: TestAPI
    }

    interface ExpectStatic {
      <T = any>(actual: T): Assertion<T>
      extend(matchers: Record<string, any>): void
      assertions(count: number): void
      hasAssertions(): void
      soft: ExpectStatic
    }

    interface Assertion<T = any> {
      toBe(expected: any): void
      toEqual(expected: any): void
      toStrictEqual(expected: any): void
      toBeTruthy(): void
      toBeFalsy(): void
      toBeNull(): void
      toBeUndefined(): void
      toBeDefined(): void
      toBeInstanceOf(expected: any): void
      toContain(item: any): void
      toHaveLength(length: number): void
      toHaveProperty(property: string, value?: any): void
      toMatch(pattern: string | RegExp): void
      toMatchObject(object: any): void
      toHaveBeenCalled(): void
      toHaveBeenCalledTimes(times: number): void
      toHaveBeenCalledWith(...args: any[]): void
      toBeVisible(): void
      toHaveClass(className: string): void
      toHaveText(text: string): void
      toHaveAttribute(name: string, value?: string): void
      not: Assertion<T>
      resolves: Assertion<Promise<T>>
      rejects: Assertion<Promise<T>>
    }

    interface MockInstance<T extends (...args: any[]) => any> {
      (...args: Parameters<T>): ReturnType<T>
      mockClear(): this
      mockReset(): this
      mockImplementation(fn: T): this
      mockReturnValue(value: ReturnType<T>): this
      mockResolvedValue(value: Awaited<ReturnType<T>>): this
      mockRejectedValue(error: any): this
      mock: {
        calls: Parameters<T>[]
        results: { type: string; value: ReturnType<T> }[]
      }
    }

    interface ViInterface {
      fn<T extends (...args: any[]) => any>(implementation?: T): MockInstance<T>
      spyOn<T extends object, Method extends keyof T>(
        object: T,
        method: Method,
        accessType?: 'get' | 'set'
      ): MockInstance<T[Method] extends (...args: any[]) => any ? T[Method] : never>
      clearAllMocks(): void
      resetAllMocks(): void
    }
  }

  export const describe: Vitest.TestAPI
  export const test: Vitest.TestAPI
  export const it: Vitest.TestAPI
  export const expect: Vitest.ExpectStatic
  export const beforeEach: Vitest.TestAPI
  export const afterEach: Vitest.TestAPI
  export const beforeAll: Vitest.TestAPI
  export const afterAll: Vitest.TestAPI
  export const vi: Vitest.ViInterface
}

declare module 'vitest/globals' {
  const describe: import('vitest').Vitest.TestAPI
  const test: import('vitest').Vitest.TestAPI
  const it: import('vitest').Vitest.TestAPI
  const expect: import('vitest').Vitest.ExpectStatic
  const beforeEach: import('vitest').Vitest.TestAPI
  const afterEach: import('vitest').Vitest.TestAPI
  const beforeAll: import('vitest').Vitest.TestAPI
  const afterAll: import('vitest').Vitest.TestAPI
  const vi: import('vitest').Vitest.ViInterface

  export {
    describe,
    test,
    it,
    expect,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
    vi
  }
}

declare module 'vitest/matchers' {
  interface Matchers<R = void> {
    toBeVisible(): R
    toHaveClass(className: string): R
    toHaveText(text: string): R
    toHaveAttribute(name: string, value?: string): R
  }
}
