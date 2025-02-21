/// <reference types="vite/client" />

// Basic types
export type Fn = (...args: any[]) => any

// Test wrapper
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

// Test context
export interface TestContext {
  wrapper?: TestWrapper
  cleanupCallbacks: Array<() => Promise<void> | void>
  [key: string]: unknown
}

// Custom matchers
export interface CustomMatchers {
  toBeVisible(): boolean
  toHaveClass(className: string): boolean
  toHaveText(text: string): boolean
  toHaveAttribute(name: string, value?: string): boolean
}

// Mock function
export interface MockFn<T extends Fn = Fn> {
  (...args: Parameters<T>): ReturnType<T>
  mock: { calls: any[][] }
  mockClear(): void
  mockReset(): void
  mockImplementation(fn: T): this
  mockReturnValue(value: ReturnType<T>): this
}

// Test utilities
export interface TestUtils {
  mock: {
    fn: <T extends Fn>(implementation?: T) => MockFn<T>
    clearAll(): void
  }
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
}

// Augment existing types
declare global {
  const expect: {
    <T = any>(actual: T): {
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
      not: any
    } & CustomMatchers
    extend(matchers: Record<string, any>): void
  }

  interface Window {
    matchMedia: MockFn<(query: string) => {
      matches: boolean
      media: string
      onchange: null
      addListener(listener: () => void): void
      removeListener(listener: () => void): void
      addEventListener(type: string, listener: () => void): void
      removeEventListener(type: string, listener: () => void): void
      dispatchEvent(event: Event): boolean
    }>
  }

  const testUtils: TestUtils
}

// Make this a module
export {}
