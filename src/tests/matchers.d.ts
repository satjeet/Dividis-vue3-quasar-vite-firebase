/// <reference types="vitest" />

interface CustomMatchers<R = unknown> {
  toHaveBeenCalledWith(...args: any[]): R
  toHaveBeenCalled(): R
  toBeInstanceOf(constructor: Function): R
  toHaveProperty(property: string): R
  toBeDefined(): R
  toBeNull(): R
  toBe(value: any): R
  toEqual(value: any): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
