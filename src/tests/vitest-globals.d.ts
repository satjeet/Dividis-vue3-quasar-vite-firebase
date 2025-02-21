declare module 'vitest' {
  export interface TestContext {
    task: { name: string }
  }

  export const beforeAll: (fn: () => void | Promise<void>) => void
  export const afterAll: (fn: () => void | Promise<void>) => void
  export const beforeEach: (fn: (context: TestContext) => void | Promise<void>) => void
  export const afterEach: (fn: (context: TestContext) => void | Promise<void>) => void
  export const describe: (name: string, fn: () => void) => void
  export const test: (name: string, fn: (context: TestContext) => Promise<void> | void) => void
  export const expect: {
    <T = any>(actual: T): any
    extend(matchers: Record<string, any>): void
  }
  export const vi: {
    fn: <T extends Function>(impl?: T) => T
    clearAllMocks: () => void
    resetModules: () => void
  }
}

declare module 'vitest/globals' {
  export * from 'vitest'
}

// Augment existing types
declare global {
  const describe: typeof import('vitest').describe
  const test: typeof import('vitest').test
  const expect: typeof import('vitest').expect
  const vi: typeof import('vitest').vi
  const beforeAll: typeof import('vitest').beforeAll
  const afterAll: typeof import('vitest').afterAll
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
}
