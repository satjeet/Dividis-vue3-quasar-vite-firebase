/// <reference types="@types/jest" />
/// <reference path="./types/index.d.ts" />

declare module 'vitest' {
  export * from '@vitest/expect'
  export * from '@vitest/spy'

  export type TestFunction = (
    name: string,
    fn: (context?: Vi.TestContext) => void | Promise<void>,
    timeout?: number
  ) => void

  export interface Suite {
    name: string
    mode: 'run' | 'skip' | 'only' | 'todo'
    test: TestFunction
    tasks: Task[]
  }

  export interface Task {
    name: string
    mode: 'run' | 'skip' | 'only' | 'todo'
    suite?: Suite
    fn?: (context?: Vi.TestContext) => void | Promise<void>
    fails?: boolean
    timeout?: number
    concurrent?: boolean
  }

  export interface Config {
    include?: string[]
    exclude?: string[]
    globals?: boolean
    environment?: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'
    threads?: boolean | number
    isolate?: boolean
    watch?: boolean
    update?: boolean
    reporters?: Array<string | [string, Record<string, any>]>
    silent?: boolean
    api?: boolean
    clearMocks?: boolean
    restoreMocks?: boolean
    mockReset?: boolean
    common?: boolean
  }
}

// Re-export types for direct use
export * from '@vitest/expect'
export * from '@vitest/spy'
export * from './types/index'

// Extend window for jsdom
declare global {
  interface Window {
    expect: Vi.ExpectStatic
    test: Vi.TestAPI
    it: Vi.TestAPI
    describe: Vi.TestAPI
    beforeEach: Vi.TestAPI
    afterEach: Vi.TestAPI
    beforeAll: Vi.TestAPI
    afterAll: Vi.TestAPI
    vi: typeof vi
  }
}

export {} // Ensure this is treated as a module
