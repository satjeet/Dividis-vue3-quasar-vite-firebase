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
