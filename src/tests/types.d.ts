/// <reference types="vite/client" />

// Function type
export type Fn = (...args: any[]) => any

// Mock function type
export interface MockFn<T extends Fn = Fn> {
  (...args: Parameters<T>): ReturnType<T>
  mock: { calls: any[][] }
  mockClear(): void
  mockReset(): void
  mockImplementation(fn: T): this
  mockReturnValue(value: ReturnType<T>): this
}

// Test wrapper type
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

// Test context type
export interface TestContext {
  wrapper?: TestWrapper
  cleanupCallbacks: Array<() => Promise<void> | void>
  [key: string]: unknown
}

// Test utilities interface
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

// Browser API mocks
export interface StorageMock {
  getItem: MockFn<(key: string) => string | null>
  setItem: MockFn<(key: string, value: string) => void>
  removeItem: MockFn<(key: string) => void>
  clear: MockFn<() => void>
  key: MockFn<(index: number) => string | null>
  length: number
}

export interface ResizeObserverMock {
  observe: MockFn<(element: Element) => void>
  unobserve: MockFn<(element: Element) => void>
  disconnect: MockFn<() => void>
}

export interface MediaQueryListMock {
  matches: boolean
  media: string
  onchange: null | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
  addListener: MockFn<(listener: () => void) => void>
  removeListener: MockFn<(listener: () => void) => void>
  addEventListener: MockFn<(type: string, listener: () => void) => void>
  removeEventListener: MockFn<(type: string, listener: () => void) => void>
  dispatchEvent: MockFn<(event: Event) => boolean>
}

// Augment modules
declare module 'vitest' {
  interface Assertion {
    toBeVisible(): void
    toHaveClass(className: string): void
    toHaveText(text: string): void
    toHaveAttribute(name: string, value?: string): void
  }
}

declare module '@vue/test-utils' {
  export interface Wrapper extends TestWrapper {}
}

// Augment window object
declare module '@vue/runtime-core' {
  interface Window {
    ResizeObserver: new () => ResizeObserverMock
    matchMedia: MockFn<(query: string) => MediaQueryListMock>
    localStorage: StorageMock
  }
}

// Export utility type
export type Utils = {
  readonly testUtils: TestUtils
}

// Export everything
export type {
  ResizeObserverMock as ResizeObserver,
  MediaQueryListMock as MediaQueryList,
  StorageMock as Storage
}
