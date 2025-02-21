/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

import type { TestUtils, CustomMatchers, TestContext, MockFn, Fn } from './core'

// Vue Test Utils types
interface VueWrapper {
  element: Element
  exists(): boolean
  find(selector: string): VueWrapper
  findAll(selector: string): VueWrapper[]
  trigger(event: string, options?: any): Promise<void>
  text(): string
  html(): string
  classes(): string[]
}

// Augment Vue Test Utils
declare module '@vue/test-utils' {
  interface Wrapper extends VueWrapper {}
}

// Test Matchers
interface BaseMatcher<R = void> {
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
}

interface ChainableMatchers<R = void> extends BaseMatcher<R> {
  not: ChainableMatchers<R> & CustomMatchers<R>
}

// Complete assertion type
interface AssertionResult extends ChainableMatchers<void>, CustomMatchers<void> {}

// Test environment augmentations
declare global {
  // Test utilities
  const testUtils: TestUtils

  // Test context
  interface TestContext {
    utils: TestUtils
    cleanup: (fn: () => Promise<void> | void) => void
  }

  // Vitest
  const vi: {
    fn: <T extends Fn>(implementation?: T) => MockFn<T>
    mock: (path: string) => any
    clearAllMocks: () => void
    resetModules: () => void
    setSystemTime: (time: Date | number | string) => void
  }

  // Test runners
  function describe(name: string, fn: () => void): void
  function test<T = any>(name: string, fn: (context: TestContext) => Promise<T> | T): void
  function it<T = any>(name: string, fn: (context: TestContext) => Promise<T> | T): void
  function expect<T = any>(actual: T): AssertionResult

  // Hooks
  function beforeAll(fn: () => Promise<void> | void): void
  function afterAll(fn: () => Promise<void> | void): void
  function beforeEach(fn: (context: TestContext) => Promise<void> | void): void
  function afterEach(fn: (context: TestContext) => Promise<void> | void): void
}

// Test utils module augmentation
declare module './test-utils' {
  export interface Utils extends TestUtils {}
  export const utils: Utils
  export default utils

  export function createMock<T extends Fn>(implementation?: T): MockFn<T>
  export function expectCalled(mock: MockFn<any>, times?: number): void
  export function expectNotCalled(mock: MockFn<any>): void
}

// Re-export types
export type {
  Fn,
  MockFn,
  TestUtils,
  TestContext,
  CustomMatchers,
  VueWrapper as TestWrapper,
  AssertionResult as Assertion
}
