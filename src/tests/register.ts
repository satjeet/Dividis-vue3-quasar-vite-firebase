/// <reference types="vitest/globals" />
import { expect, beforeAll } from 'vitest'
import type { TestWrapper } from '@/types/test'
import type { CustomMatcher } from '@/types/vitest-matchers'

// Custom matchers interface
export interface CustomMatchers {
  toBeVisible: CustomMatcher<TestWrapper>
  toHaveClass: CustomMatcher<TestWrapper>
  toHaveText: CustomMatcher<TestWrapper>
  toHaveAttribute: CustomMatcher<TestWrapper>
}

// Reusable matchers
export const customMatchers: CustomMatchers = {
  toBeVisible(received: TestWrapper) {
    return {
      pass: received.exists(),
      message: () => 'expected element to be visible'
    }
  },
  toHaveClass(received: TestWrapper, className: string) {
    return {
      pass: received.classes().includes(className),
      message: () => `expected element to have class "${className}"`
    }
  },
  toHaveText(received: TestWrapper, text: string) {
    return {
      pass: received.text() === text,
      message: () => `expected element to have text "${text}"`
    }
  },
  toHaveAttribute(received: TestWrapper, name: string, value?: string) {
    const element = received.element as HTMLElement
    const hasAttr = element.hasAttribute(name)
    const attrValue = element.getAttribute(name)
    const pass = value ? hasAttr && attrValue === value : hasAttr

    return {
      pass,
      message: () => {
        if (value) {
          return `expected element to have attribute "${name}=${value}"`
        }
        return `expected element to have attribute "${name}"`
      }
    }
  }
}

// Register matchers
beforeAll(() => {
  // Type assertion to access extend method
  const expectWithExtend = expect as unknown as { extend(matchers: Record<string, any>): void }
  expectWithExtend.extend(customMatchers)
})

// Augment Vitest matchers
declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
