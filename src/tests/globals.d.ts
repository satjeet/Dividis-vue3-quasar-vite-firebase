/// <reference types="vite/client" />
import type { expect } from 'vitest'

declare global {
  export const describe: typeof import('vitest')['describe']
  export const test: typeof import('vitest')['test']
  export const it: typeof import('vitest')['it']
  export const expect: typeof import('vitest')['expect']
  export const beforeAll: typeof import('vitest')['beforeAll']
  export const afterAll: typeof import('vitest')['afterAll']
  export const beforeEach: typeof import('vitest')['beforeEach']
  export const afterEach: typeof import('vitest')['afterEach']
  export const vi: typeof import('vitest')['vi']
}

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveLength(length: number): void
    toBeInTheDocument(): void
    toHaveClass(className: string): void
    toHaveStyle(style: Record<string, any>): void
    toHaveAttribute(attr: string, value?: string): void
    toHaveTextContent(text: string | RegExp): void
    toBePending(): void
    toBeResolved(): void
    toBeRejected(): void
    toBeCompletedWithin(ms: number): void
  }

  interface AsymmetricMatchersContaining {
    toHaveLength(length: number): void
    toBeInTheDocument(): void
    toHaveClass(className: string): void
    toHaveStyle(style: Record<string, any>): void
    toHaveAttribute(attr: string, value?: string): void
    toHaveTextContent(text: string | RegExp): void
    toBePending(): void
    toBeResolved(): void
    toBeRejected(): void
    toBeCompletedWithin(ms: number): void
  }
}

export {}
