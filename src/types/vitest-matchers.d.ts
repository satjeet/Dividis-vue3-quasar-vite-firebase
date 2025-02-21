/// <reference types="vitest" />
import type { TestWrapper } from './test'

declare module 'vitest' {
  interface ExpectStatic {
    extend(matchers: Record<string, any>): void
  }

  interface Assertion<T = any> {
    toBeVisible(): void
    toHaveClass(className: string): void
    toHaveText(text: string): void
    toHaveAttribute(name: string, value?: string): void
  }

  interface AsymmetricMatchersContaining {
    toBeVisible(): void
    toHaveClass(className: string): void
    toHaveText(text: string): void
    toHaveAttribute(name: string, value?: string): void
  }

  interface TestAPI {
    extend(matchers: Record<string, any>): void
  }
}

// Extend global expect
declare global {
  namespace Vi {
    interface Assertion extends Omit<ExpectStatic, 'extend'> {
      extend(matchers: Record<string, any>): void
    }

    interface AsymmetricMatchersContaining {
      toBeVisible(): void
      toHaveClass(className: string): void
      toHaveText(text: string): void
      toHaveAttribute(name: string, value?: string): void
    }
  }
}

// Matcher types
export interface CustomMatcher<T = any> {
  (received: T, ...args: any[]): {
    pass: boolean
    message: () => string
  }
}

export interface CustomMatchers {
  toBeVisible: CustomMatcher<TestWrapper>
  toHaveClass: CustomMatcher<TestWrapper>
  toHaveText: CustomMatcher<TestWrapper>
  toHaveAttribute: CustomMatcher<TestWrapper>
}

// Make expect.extend available globally
declare global {
  const expect: Vi.ExpectStatic & {
    extend(matchers: Partial<CustomMatchers>): void
  }
}
