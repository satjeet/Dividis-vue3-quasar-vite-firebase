/// <reference types="@types/jest" />

declare global {
  namespace Vi {
    interface ExpectStatic {
      <T = any>(actual: T): Assertion<T>
      extend(matchers: Record<string, any>): void
      assertions(count: number): void
      hasAssertions(): void
      soft: ExpectStatic
      any(constructor?: any): any
      anything(): any
      arrayContaining(arr: any[]): any
      objectContaining(obj: any): any
      stringContaining(str: string): any
      stringMatching(str: string | RegExp): any
    }

    interface Assertion<T = any> {
      // Standard assertions
      toBe(expected: any): void
      toEqual(expected: any): void
      toStrictEqual(expected: any): void
      toBeTruthy(): void
      toBeFalsy(): void
      toBeNull(): void
      toBeUndefined(): void
      toBeDefined(): void
      toBeNaN(): void
      toBeInstanceOf(expected: any): void
      toBeGreaterThan(expected: number): void
      toBeGreaterThanOrEqual(expected: number): void
      toBeLessThan(expected: number): void
      toBeLessThanOrEqual(expected: number): void
      toContain(item: any): void
      toHaveLength(length: number): void
      toHaveProperty(property: string, value?: any): void
      toMatch(pattern: string | RegExp): void
      toThrow(message?: string | RegExp): void
      toThrowError(message?: string | RegExp): void

      // Mock assertions
      toHaveBeenCalled(): void
      toHaveBeenCalledTimes(times: number): void
      toHaveBeenCalledWith(...args: any[]): void
      toHaveBeenLastCalledWith(...args: any[]): void
      toHaveBeenNthCalledWith(n: number, ...args: any[]): void
      toHaveReturned(): void
      toHaveReturnedTimes(times: number): void
      toHaveReturnedWith(value: any): void
      toHaveLastReturnedWith(value: any): void
      toHaveNthReturnedWith(n: number, value: any): void

      // Custom assertions
      toBeVisible(): void
      toHaveClass(className: string): void
      toHaveText(text: string): void
      toHaveAttribute(name: string, value?: string): void

      // Negation and chains
      not: Assertion<T>
      resolves: Assertion<Promise<T>>
      rejects: Assertion<Promise<T>>
    }

    type Mock<T extends (...args: any[]) => any> = {
      new (...args: Parameters<T>): ReturnType<T>
      (...args: Parameters<T>): ReturnType<T>
      mockImplementation(fn: T): Mock<T>
      mockReturnValue(value: ReturnType<T>): Mock<T>
      mockResolvedValue(value: Awaited<ReturnType<T>>): Mock<T>
      mockRejectedValue(value: any): Mock<T>
      mockClear(): Mock<T>
      mockReset(): Mock<T>
      mockRestore(): Mock<T>
      getMockName(): string
      mock: {
        calls: Parameters<T>[]
        instances: ReturnType<T>[]
        invocationCallOrder: number[]
        results: { type: string; value: ReturnType<T> }[]
        lastCall?: Parameters<T>
      }
    }

    interface Vi {
      fn<T extends (...args: any[]) => any>(implementation?: T): Mock<T>
      spyOn<T extends object, K extends keyof T>(object: T, method: K): Mock<T[K]>
      mock<T extends object>(path: string, factory?: () => T): jest.Mocked<T>
      hoisted<T>(factory: () => T): T
      unmock(path: string): void
      stubGlobal(name: string, value: any): void
      unstubAllGlobals(): void
      setSystemTime(time: number | Date): void
      restoreCurrentDate(): void
      advanceTimersByTime(ms: number): void
      runOnlyPendingTimers(): void
      useRealTimers(): void
      useFakeTimers(config?: { now?: number | Date }): void
      clearAllTimers(): void
      getMockedSystemTime(): Date | null
      advanceTimersToNextTimer(): void
      getTimerCount(): number
      clearAllMocks(): void
      resetAllMocks(): void
      restoreAllMocks(): void
    }

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
  }

  var expect: Vi.ExpectStatic
  var describe: Vi.TestAPI
  var it: Vi.TestAPI
  var test: Vi.TestAPI
  var beforeAll: Vi.TestAPI
  var beforeEach: Vi.TestAPI
  var afterAll: Vi.TestAPI
  var afterEach: Vi.TestAPI
  var vi: Vi.Vi
}

export {}
