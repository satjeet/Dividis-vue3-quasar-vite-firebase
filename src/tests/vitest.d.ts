/// <reference types="vite/client" />
/// <reference types="node" />

declare module 'vitest' {
  interface MockInstance<T = any> {
    new (...args: any[]): T
    (...args: any[]): any
    mockImplementation(fn: (...args: any[]) => any): this
    mockReturnValue(val: any): this
    mockResolvedValue(val: any): this
    mockRejectedValue(val: any): this
    mockReset(): void
    mockClear(): void
    mockRestore(): void
    getMockName(): string
    mockImplementationOnce(fn: (...args: any[]) => any): this
    mockReturnValueOnce(val: any): this
    mockResolvedValueOnce(val: any): this
    mockRejectedValueOnce(val: any): this
    mock: {
      calls: any[][]
      instances: any[]
      invocationCallOrder: number[]
      results: Array<{ type: 'return' | 'throw'; value: any }>
      lastCall: any[]
    }
  }

  interface Vi {
    useFakeTimers(config?: { shouldAdvanceTime?: boolean; advanceTimeDelta?: number; maxTime?: number }): void
    useRealTimers(): void
    runAllTimers(): void
    runOnlyPendingTimers(): void
    advanceTimersByTime(ms: number): void
    advanceTimersToNextTimer(): void
    getTimerCount(): number
    clearAllTimers(): void
    spyOn<T extends object, K extends keyof T>(obj: T, method: K): MockInstance<T[K]>
    fn<T extends Function>(implementation?: T): MockInstance<T>
    clearAllMocks(): void
    resetModules(): void
    setSystemTime(time: number | Date): void
    getRealSystemTime(): number
    isFakeTimers(): boolean
  }

  interface BaseMatchers<R = void> {
    toBe(expected: any): R
    toEqual(expected: any): R
    toStrictEqual(expected: any): R
    toBeNull(): R
    toBeUndefined(): R
    toBeDefined(): R
    toBeTruthy(): R
    toBeFalsy(): R
    toContain(expected: any): R
    toThrow(message?: string | RegExp): R
    toBeLessThanOrEqual(n: number): R
    toBeGreaterThanOrEqual(n: number): R
    toHaveLength(length: number): R
    toHaveProperty(key: string, value?: any): R
    toBeInstanceOf(constructor: Function): R
    toMatch(pattern: string | RegExp): R
    toMatchObject(object: object): R
    toMatchSnapshot(name?: string): R
    toMatchInlineSnapshot(snapshot: string): R
    not: BaseMatchers<R>
    resolves: BaseMatchers<Promise<R>>
    rejects: BaseMatchers<Promise<R>>
  }

  interface ExpectStatic {
    <T = any>(actual: T): BaseMatchers<void>
    assertions(count: number): void
    extend(matchers: Record<string, Function>): void
    hasAssertions(): void
    any(constructor: Function): any
    anything(): any
    stringContaining(str: string): any
    stringMatching(str: string | RegExp): any
    objectContaining<T extends object>(obj: T): T
    arrayContaining<T extends any[]>(arr: T): T
  }

  export { MockInstance, Vi, BaseMatchers, ExpectStatic }
  export const vi: Vi
  export const expect: ExpectStatic
}

declare module '@vitest/globals' {
  export * from 'vitest'
}

declare global {
  export const vi: import('vitest').Vi
  export const expect: import('vitest').ExpectStatic
  export const setImmediate: (callback: () => void) => void
  export const clearImmediate: (id: any) => void
  export const performance: { now(): number }
  export const gc: undefined | (() => void)

  export interface Error {
    code?: string | number
    cause?: unknown
    expected?: unknown
    actual?: unknown
    message: string
    stack?: string
    diff?: string
    showDiff?: boolean
    operators?: { actual?: string; expected?: string }
  }
}

export {}
