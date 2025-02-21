/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface CustomMatchers<R = unknown> {
  toHaveBeenCalledWith(...args: any[]): R
  toEqual(expected: any): R
  toBe(expected: any): R
  toHaveLength(length: number): R
  toContain(item: unknown): R
  toBeNull(): R
  toBeDefined(): R
  toBeUndefined(): R
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
