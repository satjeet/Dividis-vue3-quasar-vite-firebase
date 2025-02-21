/// <reference types="vite/client" />

// Base types
export type Fn = (...args: any[]) => any

// Mock function type
export interface MockFn<T extends Fn = Fn> {
  (...args: Parameters<T>): ReturnType<T>
  mock: { calls: any[][] }
  mockImplementation(fn: T): MockFn<T>
  mockReturnValue(value: ReturnType<T>): MockFn<T>
  mockReset(): void
}

// Element wrapper type
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
export interface CustomMatchers<R = unknown> {
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

// Augment Vue Test Utils
declare module '@vue/test-utils' {
  export interface Wrapper extends TestWrapper {}
}

// Augment Vitest
declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

// Augment Vue Runtime
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $style: { [key: string]: string }
  }
}

// Declare test functions
declare module 'vitest/globals' {
  export const utils: TestUtils

  export const vi: {
    fn: <T extends Fn>(implementation?: T) => MockFn<T>
    mock: (path: string) => any
    clearAllMocks: () => void
    resetModules: () => void
    setSystemTime: (time: Date | number | string) => void
  }

  export function describe(name: string, fn: () => void): void
  export function test<T = any>(name: string, fn: (context: TestContext) => Promise<T> | T): void
  export function it<T = any>(name: string, fn: (context: TestContext) => Promise<T> | T): void
  export function expect<T = any>(actual: T): jest.Matchers<T> & CustomMatchers
  export function beforeAll(fn: () => Promise<void> | void): void
  export function afterAll(fn: () => Promise<void> | void): void
  export function beforeEach(fn: () => Promise<void> | void): void
  export function afterEach(fn: () => Promise<void> | void): void
}

// Make imports/exports explicit
declare module './test-utils' {
  const testUtils: TestUtils
  export default testUtils
  export * from './environment'
}
