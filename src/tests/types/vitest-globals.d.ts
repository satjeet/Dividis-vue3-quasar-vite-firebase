/// <reference types="vite/client" />

declare module 'vitest' {
  interface Suite {
    test: typeof test
    it: typeof test
    describe: typeof describe
    beforeAll: typeof beforeAll
    afterAll: typeof afterAll
    beforeEach: typeof beforeEach
    afterEach: typeof afterEach
  }

  interface TestAPI {
    test: typeof test
    it: typeof test
    describe: typeof describe
    beforeAll: typeof beforeAll
    afterAll: typeof afterAll
    beforeEach: typeof beforeEach
    afterEach: typeof afterEach
    expect: typeof expect
    vi: typeof vi
  }

  interface ExpectStatic {
    extend(matchers: Record<string, any>): void
  }
}

declare global {
  const describe: typeof import('vitest')['describe']
  const test: typeof import('vitest')['test']
  const it: typeof import('vitest')['it']
  const expect: typeof import('vitest')['expect']
  const beforeAll: typeof import('vitest')['beforeAll']
  const afterAll: typeof import('vitest')['afterAll']
  const beforeEach: typeof import('vitest')['beforeEach']
  const afterEach: typeof import('vitest')['afterEach']
  const vi: typeof import('vitest')['vi']

  namespace Vi {
    interface Assertion {
      toHaveLength(length: number): void
      toBeInTheDocument(): void
      toHaveClass(className: string): void
      toHaveStyle(style: Record<string, any>): void
      toHaveAttribute(attr: string, value?: string): void
      toHaveTextContent(text: string | RegExp): void
    }
  }
}

export {}
