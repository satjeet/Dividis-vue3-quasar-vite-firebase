declare module 'vitest/config' {
  import type { UserConfig as ViteUserConfig } from 'vite'

  export interface InlineConfig {
    globals?: boolean
    environment?: 'node' | 'jsdom' | 'happy-dom'
    environmentOptions?: Record<string, any>
    setupFiles?: string[]
    include?: string[]
    exclude?: string[]
    testTimeout?: number
    hookTimeout?: number
    teardownTimeout?: number
    silent?: boolean
    passWithNoTests?: boolean
    bail?: number | boolean
    sequence?: {
      hooks?: 'parallel' | 'serial'
      shuffle?: boolean
    }
    watch?: boolean
    update?: boolean
    reporters?: Array<string | [string, Record<string, any>]>
    restoreMocks?: boolean
    clearMocks?: boolean
    mockReset?: boolean
    coverage?: {
      provider?: 'c8' | 'istanbul' | 'v8'
      reporter?: Array<'text' | 'json' | 'html'>
      exclude?: string[]
      include?: string[]
      all?: boolean
      clean?: boolean
      reportsDirectory?: string
      lines?: number
      functions?: number
      branches?: number
      statements?: number
    }
    deps?: {
      inline?: boolean | Array<string | RegExp>
      fallbackCJS?: boolean
      interopDefault?: boolean
      external?: string[]
      moduleDirectories?: string[]
    }
    alias?: Record<string, string>
    root?: string
    threads?: boolean
    isolate?: boolean
    maxConcurrency?: number
    maxWorkers?: number
    minWorkers?: number
  }

  export interface UserConfig extends ViteUserConfig {
    test?: InlineConfig
    define?: Record<string, any>
  }

  export function defineConfig(config: UserConfig): UserConfig
}

declare module 'vitest' {
  export interface Matchers<R = void, T = {}> {
    toBe(expected: any): R
    toBeDefined(): R
    toBeTruthy(): R
    toBeFalsy(): R
    toBeNull(): R
    toBeUndefined(): R
    toEqual(expected: any): R
    toStrictEqual(expected: any): R
    toContain(item: any): R
    toMatch(pattern: RegExp | string): R
    toHaveLength(length: number): R
    toHaveProperty(property: string, value?: any): R
    toBeInstanceOf(constructor: any): R
    toThrow(error?: string | RegExp | Error): R
    resolves: Matchers<Promise<R>, T>
    rejects: Matchers<Promise<R>, T>
  }

  export interface SpyInstance<T extends (...args: any) => any> {
    getMockName(): string
    mock: {
      calls: Parameters<T>[]
      results: { type: 'return' | 'throw'; value: ReturnType<T> }[]
      instances: any[]
      lastCall: Parameters<T>
      invocationCallOrder: number[]
    }
    mockClear(): void
    mockReset(): void
    mockRestore(): void
    mockImplementation(fn: T): SpyInstance<T>
    mockImplementationOnce(fn: T): SpyInstance<T>
    mockReturnValue(value: ReturnType<T>): SpyInstance<T>
    mockReturnValueOnce(value: ReturnType<T>): SpyInstance<T>
    mockResolvedValue<U>(value: U): SpyInstance<T>
    mockRejectedValue(value: any): SpyInstance<T>
  }

  export interface TestContext {
    skip(): void
    only(): void
    todo(): void
    timeout(ms: number): void
    retry(times: number): void
    each<T extends any[]>(cases: T[]): void
  }

  export type TestFunction = {
    (name: string, fn: (context: TestContext) => void | Promise<void>): void
    skip: TestFunction
    only: TestFunction
    todo: TestFunction
    concurrent: TestFunction
    each: TestFunction
    failing: TestFunction
    runIf(condition: boolean): TestFunction
  }

  export const describe: TestFunction & { each: TestFunction }
  export const test: TestFunction
  export const it: TestFunction
  export const beforeAll: (fn: () => void | Promise<void>) => void
  export const afterAll: (fn: () => void | Promise<void>) => void
  export const beforeEach: (fn: () => void | Promise<void>) => void
  export const afterEach: (fn: () => void | Promise<void>) => void

  export const expect: {
    <T = any>(actual: T): Matchers<void, T>
    extend(matchers: Record<string, Function>): void
    assertions(count: number): void
    hasAssertions(): void
    soft: typeof expect
  }

  export const vi: {
    fn<T extends (...args: any[]) => any>(implementation?: T): SpyInstance<T>
    spyOn<T extends object, K extends keyof T>(object: T, method: K): SpyInstance<T[K]>
    mock<T extends object = any>(moduleName: string): T
    useFakeTimers(): void
    useRealTimers(): void
    runAllTimers(): void
    runOnlyPendingTimers(): void
    advanceTimersByTime(ms: number): void
    resetAllMocks(): void
    restoreAllMocks(): void
    clearAllMocks(): void
    setSystemTime(time: number | Date): void
    getMockedSystemTime(): number | null
    advanceTimersToNextTimer(): void
  }
}
