/// <reference types="vite/client" />

interface CustomMatchers<R = unknown> {
  toHaveBeenCalledWith(...args: any[]): R
  toEqual(expected: any): R
  toBe(expected: any): R
}

declare global {
  const describe: (name: string, fn: () => void) => void
  const test: (name: string, fn: () => void | Promise<void>) => void
  const expect: {
    <T>(actual: T): CustomMatchers
    assertions(n: number): void
  }
  const beforeEach: (fn: () => void | Promise<void>) => void
  const afterEach: (fn: () => void | Promise<void>) => void
  const vi: {
    fn(): (...args: any[]) => any
    clearAllMocks(): void
  }
}

export {}
