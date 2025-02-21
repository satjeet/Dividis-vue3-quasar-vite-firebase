import type { ComponentPublicInstance } from 'vue'

export interface TimerConfig {
  shouldAdvanceTime?: boolean
  advanceTimeDelta?: number
  maxTime?: number
  shouldClearNativeTimers?: boolean
}

export interface TimerAPI {
  useFakeTimers(config?: TimerConfig): void
  useRealTimers(): void
  runAllTimers(): void
  runOnlyPendingTimers(): void
  advanceTimersByTime(ms: number): void
  advanceTimersToNextTimer(): void
  getTimerCount(): number
  clearAllTimers(): void
}

export interface Vi extends TimerAPI {
  spyOn<T extends object, M extends keyof T>(
    object: T,
    method: M & (T[M] extends (...args: any[]) => any ? M : never)
  ): MockFunction<T[M] extends (...args: any[]) => any ? T[M] : never>
  isFakeTimers(): boolean
  mocked<T extends (...args: any[]) => any>(item: T): MockFunction<T>
  mock<T extends object = any>(path: string, factory?: () => T): T
  setSystemTime(time: number | Date): void
  getRealSystemTime(): number
  fn: <T extends (...args: any[]) => any>(implementation?: T) => MockFunction<T>
  clearAllMocks(): void
  resetModules(): void
}

export interface MockFunction<T extends (...args: any[]) => any> {
  new (...args: any[]): any
  (...args: Parameters<T>): ReturnType<T>
  mockImplementation(fn: T): this
  mockReturnValue(val: ReturnType<T>): this
  mockResolvedValue(val: Awaited<ReturnType<T>>): this
  mockRejectedValue(val: any): this
  mockReset(): void
  mockClear(): void
  mockRestore(): void
  getMockName(): string
  mockImplementationOnce(fn: T): this
  mockReturnValueOnce(val: ReturnType<T>): this
  mockResolvedValueOnce(val: Awaited<ReturnType<T>>): this
  mockRejectedValueOnce(val: any): this
  mock: {
    calls: Parameters<T>[]
    instances: any[]
    invocationCallOrder: number[]
    results: Array<{
      type: 'return' | 'throw'
      value: ReturnType<T> | Error
    }>
    lastCall: Parameters<T>
  }
}

export interface BaseMatchers<R = void> {
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
}

export interface AsyncMatchers<R = void> extends BaseMatchers<Promise<R>> {
  rejects: AsyncMatchers<R>
  resolves: AsyncMatchers<R>
  toHaveBeenCalled(): Promise<R>
  toHaveBeenCalledTimes(times: number): Promise<R>
  toHaveBeenCalledWith(...args: any[]): Promise<R>
  toHaveBeenLastCalledWith(...args: any[]): Promise<R>
  toHaveBeenNthCalledWith(n: number, ...args: any[]): Promise<R>
}

export interface ExpectStatic {
  <T = any>(actual: T): Matchers<void> & AsyncMatchers<void>
  assertions(count: number): void
  extend(matchers: Record<string, Function>): void
  getState(): { assertionCalls: number; isExpectingAssertions: boolean }
  setState(state: { assertionCalls: number; isExpectingAssertions: boolean }): void
  hasAssertions(): void
  any(constructor?: Function): any
  anything(): any
  stringContaining(str: string): any
  stringMatching(str: string | RegExp): any
  objectContaining<T extends object>(obj: T): T
  arrayContaining<T extends any[]>(arr: T): T
  addSnapshotSerializer(serializer: unknown): void
}

export interface Matchers<R = void> extends BaseMatchers<R> {
  toBeVisible(): R
  toBeHidden(): R
  toHaveClass(className: string | string[]): R
  toHaveStyle(style: string | Record<string, any>): R
  toHaveAttribute(key: string, value?: string): R
  toHaveEmitted(event: string, ...args: any[]): R
  toHaveEmittedTimes(event: string, times: number): R
  toHaveElement(selector: string): R
  toHaveComponent(component: any): R
  toBeInStore(): R
  toHaveStoreState(expected: any): R
  toHaveGetterValue(getterName: string, expected: any): R
  toHaveMutation(type: string, payload?: any): R
  toHaveAction(type: string, payload?: any): R
  rejects: AsyncMatchers<Promise<R>>
  resolves: AsyncMatchers<Promise<R>>
}
