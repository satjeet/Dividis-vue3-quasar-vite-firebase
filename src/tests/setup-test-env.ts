import type {
  TestUtils,
  TestContext,
  Matchers,
  MockFn,
  TestWrapper,
  CustomMatchers,
  TestImplementation
} from './test-env'

// Create mock test utilities instance
const utils: TestUtils = {
  dom: {
    findByTestId(wrapper: TestWrapper, id: string) {
      return wrapper.find(`[data-test="${id}"]`)
    },
    findAllByTestId(wrapper: TestWrapper, id: string) {
      return wrapper.findAll(`[data-test="${id}"]`)
    },
    exists(wrapper: TestWrapper) {
      return wrapper.exists()
    },
    text(wrapper: TestWrapper) {
      return wrapper.text()
    },
    async click(wrapper: TestWrapper) {
      await wrapper.trigger('click')
    },
    async type(wrapper: TestWrapper, value: string) {
      await wrapper.trigger('input', { target: { value } })
    }
  },
  timing: {
    async wait(ms: number) {
      await new Promise(resolve => setTimeout(resolve, ms))
    },
    async nextTick() {
      await Promise.resolve()
    },
    async until<T>(predicate: () => T | null | undefined) {
      const start = Date.now()
      const timeout = 5000
      const interval = 50

      while (Date.now() - start < timeout) {
        const result = predicate()
        if (result) return result as NonNullable<T>
        await new Promise(resolve => setTimeout(resolve, interval))
      }
      throw new Error('Timeout waiting for condition')
    }
  },
  mock: {
    fn: vi.fn,
    clearAll: vi.clearAllMocks
  }
}

// Create custom matchers
const customMatchers = {
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
    const hasAttr = (received.element as HTMLElement).hasAttribute(name)
    const attrValue = (received.element as HTMLElement).getAttribute(name)
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

// Register custom matchers
expect.extend(customMatchers)

// Create test implementation
export const implementation: TestImplementation = {
  utils,
  createMock: vi.fn,
  expectCalled(mock: MockFn, times?: number) {
    if (typeof times === 'number') {
      expect(mock).toHaveBeenCalledTimes(times)
    } else {
      expect(mock).toHaveBeenCalled()
    }
  },
  expectNotCalled(mock: MockFn) {
    expect(mock).not.toHaveBeenCalled()
  }
}

// Export globals type
declare global {
  export const utils: typeof implementation.utils
}

// Export everything
export {
  utils,
  customMatchers,
  type TestUtils,
  type TestContext,
  type Matchers,
  type MockFn,
  type TestWrapper,
  type CustomMatchers
}
