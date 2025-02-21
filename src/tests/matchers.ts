import type { TestWrapper } from '@/types/test'

declare module 'vitest' {
  interface Assertion {
    toBeVisible(): void
    toHaveClass(className: string): void
    toHaveText(text: string): void
    toHaveAttribute(name: string, value?: string): void
  }
}

// Custom matchers
export const customMatchers = {
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
} as const

// Matcher type
export type Matchers = typeof customMatchers
