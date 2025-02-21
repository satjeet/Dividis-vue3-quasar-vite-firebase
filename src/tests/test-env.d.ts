/// <reference types="vite/client" />

// Base types
export type Fn = (...args: any[]) => any

export interface MockFn<T extends Fn = Fn> {
  (...args: Parameters<T>): ReturnType<T>
  mock: { calls: any[][] }
  mockImplementation(fn: T): MockFn<T>
  mockReturnValue(value: ReturnType<T>): MockFn<T>
  mockReset(): void
}

export interface TestWrapper {
  element: Element
  exists(): boolean
  find(selector: string): TestWrapper
  findAll(selector: string): TestWrapper[]
  trigger(event: string, options?: any): Promise<void>
  text(): string
  html(): string
  classes(): string[]
}

// Test utilities
export interface TestUtils {
  dom: {
    findByTestId(wrapper: TestWrapper, id: string): TestWrapper
    findAllByTestId(wrapper: TestWrapper, id: string): TestWrapper[]
    exists(wrapper: TestWrapper): boolean
    text(wrapper: TestWrapper): string
    click(wrapper: TestWrapper): Promise<void>
    type(wrapper: TestWrapper, value: string): Promise<void>
  }
  timing: {
    wait(ms: number): Promise<void>
    nextTick(): Promise<void>
    until<T>(predicate: () => T | null | undefined): Promise<NonNullable<T>>
  }
  mock: {
    fn: <T extends Fn>(implementation?: T) => MockFn<T>
    clearAll(): void
  }
}

// Custom matchers
export interface CustomMatchers<R = void> {
  toBeVisible(): R
  toHaveClass(className: string): R
  toHaveText(text: string): R
  toHaveAttribute(name: string, value?: string): R
}

// Test context
export interface TestContext {
  utils: TestUtils
  cleanup: (fn: () => Promise<void> | void) => void
}

// Matchers
export interface BaseMatcher<R = void> {
  toBe(expected: any): R
  toEqual(expected: any): R
  toBeDefined(): R
  toBeUndefined(): R
  toBeTruthy(): R
  toBeFalsy(): R
  toContain(expected: any): R
  toHaveLength(length: number): R
  toHaveBeenCalled(): R
  toHaveBeenCalledTimes(times: number): R
  toHaveBeenCalledWith(...args: any[]): R
  not: BaseMatcher<R> & CustomMatchers<R>
}

// Complete matchers
export interface Matchers extends BaseMatcher<void>, CustomMatchers<void> {}

// Test function signatures
export type TestFn = <T = any>(name: string, fn: (context: TestContext) => Promise<T> | T) => void
export type DescribeFn = (name: string, fn: () => void) => void
export type HookFn = (fn: (context: TestContext) => Promise<void> | void) => void

// Module augmentations
declare module '@vue/test-utils' {
  export interface Wrapper extends TestWrapper {}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $style: { [key: string]: string }
  }
}

// Test utilities
export interface TestImplementation {
  utils: TestUtils
  createMock: <T extends Fn>(implementation?: T) => MockFn<T>
  expectCalled: (mock: MockFn<any>, times?: number) => void
  expectNotCalled: (mock: MockFn<any>) => void
}
