/// <reference types="vitest/globals" />

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveBeenCalledWith(...args: any[]): T
    toHaveBeenCalled(): T
    toBeInstanceOf(constructor: Function): T
    toHaveProperty(property: string): T
    toBeDefined(): T
    toBeNull(): T
    toBe(value: any): T
    toEqual(value: any): T
    toBeGreaterThan(value: number): T
  }
}

// Test Utilities Types
export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: any) => void
}

export interface EventMock<T extends string = string> {
  type: T
  preventDefault: jest.Mock
  stopPropagation: jest.Mock
  [key: string]: any
}

export interface WaitForOptions {
  timeout?: number
  interval?: number
  message?: string
}

// Test Assertion Types
export interface AssertionResult {
  pass: boolean
  message: () => string
}

export type TypeGuard<T> = (value: unknown) => value is T

export type AsyncOperation<T> = () => Promise<T>

export type Condition = () => boolean | Promise<boolean>

// Error Types
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssertionError'
  }
}

// Mock Types
export interface MockOptions {
  name?: string
  implementation?: (...args: any[]) => any
}

export interface MockResult<T = any> {
  type: 'return' | 'throw'
  value: T
}

export interface MockContext {
  calls: any[][]
  results: MockResult[]
  instances: any[]
  lastCall: any[]
}
