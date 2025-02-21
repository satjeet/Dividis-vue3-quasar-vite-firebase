import { describe, it, expect } from 'vitest'
import {
  initTestEnv,
  createTest,
  withRetry,
  createSuite,
  TestAssertions,
  createMock,
  waitDelay as delay,
  waitFor
} from '../config'
import { TimeoutError } from '../utils/errors'

/**
 * Example test suite demonstrating test configuration features
 */
describe('Test Configuration Examples', () => {
  // Standard test with timing
  createTest('should track test timing', async () => {
    await delay(100)
    expect(true).toBe(true)
  })()

  // Test with retries
  createTest('should retry failed operations', async () => {
    let attempts = 0
    await withRetry(async () => {
      attempts++
      if (attempts < 2) throw new Error('First attempt')
      return 'success'
    })
    expect(attempts).toBe(2)
  })()

  // Test with async validation
  createTest('should validate async operations', async () => {
    const operation = async () => {
      await delay(50)
      return 'result'
    }

    await TestAssertions.assertCompletes(operation)
  })()

  // Test with conditions
  createTest('should wait for conditions', async () => {
    let flag = false
    setTimeout(() => { flag = true }, 50)

    await waitFor(() => flag)
    expect(flag).toBe(true)
  })()

  // Test with mock tracking
  createTest('should track mock calls', async () => {
    const mock = createMock()
    await delay(50)
    mock('test')
    TestAssertions.assertMockCalls(mock, ['test'])
  })()
})

// Example of a complete test suite
createSuite('Complete Test Suite', {
  'should handle successful tests': async () => {
    const result = await withRetry(async () => 'success')
    expect(result).toBe('success')
  },

  'should handle timeouts': async () => {
    await expect(
      waitFor(() => false, { timeout: 100 })
    ).rejects.toThrow('Condition not met within timeout')
  },

  'should track async operations': async () => {
    const start = Date.now()
    await delay(100)
    expect(Date.now() - start).toBeGreaterThanOrEqual(100)
  }
})

// Example with custom configuration
const customEnv = initTestEnv({
  timeout: 2000,
  retries: 2,
  verbose: true
})

const { createSuite: createCustomSuite, withRetry: withCustomRetry } = customEnv

createCustomSuite('Custom Config Suite', {
  'should use custom timeouts': async () => {
    await TestAssertions.assertCompletes(
      async () => delay(100),
      { timeout: 2000 }
    )
  },

  'should use custom retries': async () => {
    let attempts = 0
    await withCustomRetry(async () => {
      attempts++
      if (attempts < 2) throw new Error('Retry test')
      return 'success'
    })
    expect(attempts).toBe(2)
  }
})

// Example with type safety
interface User {
  id: number
  name: string
}

createSuite('Type-Safe Tests', {
  'should handle typed operations': async () => {
    const userMock = createMock<() => Promise<User>>()
    userMock.mockResolvedValue({ id: 1, name: 'Test' })

    const user = await userMock()
    expect(user.id).toBe(1)
    expect(user.name).toBe('Test')
  },

  'should validate types': async () => {
    const isUser = (x: unknown): x is User =>
      typeof x === 'object' && x !== null &&
      'id' in x && typeof x.id === 'number' &&
      'name' in x && typeof x.name === 'string'

    const user = { id: 1, name: 'Test' }
    TestAssertions.assertType(user, isUser)
  }
})

// Example with error handling
createSuite('Error Handling', {
  'should handle test failures': async () => {
    await expect(
      createTest('failing test', async () => {
        throw new Error('Test error')
      })()
    ).rejects.toThrow('Test error')
  },

  'should handle retry exhaustion': async () => {
    await expect(
      withRetry(
        async () => { throw new Error('Always fails') },
        1
      )
    ).rejects.toThrow('Always fails')
  },

  'should handle invalid operations': async () => {
    await expect(
      TestAssertions.assertCompletes(
        async () => { throw new Error('Invalid') }
      )
    ).rejects.toThrow('Invalid')
  }
})
