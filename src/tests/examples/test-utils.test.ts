import { describe, it, expect } from 'vitest'
import { TestAssertions, delay, waitFor, createEvent, createDeferred, createMock } from '../utils/test-helpers'
import { TimeoutError, AssertionError } from '../utils/errors'

describe('Test Utilities Examples', () => {
  describe('Assertions', () => {
    it('should assert errors', () => {
      const error = new Error('test error')
      TestAssertions.assertError(error, 'test error')
    })

    it('should assert mock calls', () => {
      const mock = createMock()
      mock('test')
      TestAssertions.assertMockCalls(mock, ['test'])
    })

    it('should assert async operations complete', async () => {
      await TestAssertions.assertCompletes(async () => {
        await delay(50)
        return true
      })
    })

    it('should fail on timeout', async () => {
      await expect(
        TestAssertions.assertCompletes(
          () => new Promise(resolve => setTimeout(resolve, 200)),
          { timeout: 100 }
        )
      ).rejects.toThrow(TimeoutError)
    })

    it('should assert properties', () => {
      const obj = { name: 'test', value: 123 }
      TestAssertions.assertProperties(obj, ['name', 'value'])
    })

    it('should assert type guards', () => {
      interface User {
        id: number
        name: string
      }

      const isUser = (value: unknown): value is User =>
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value

      const user = { id: 1, name: 'test' }
      TestAssertions.assertType(user, isUser)
    })

    it('should assert sequential operations', async () => {
      const results = await TestAssertions.assertSequential([
        async () => 1,
        async () => 2,
        async () => 3
      ])
      expect(results).toEqual([1, 2, 3])
    })

    it('should assert throws', async () => {
      await TestAssertions.assertThrows(
        () => {
          throw new Error('test error')
        },
        Error,
        'test error'
      )
    })

    it('should assert pattern matches', () => {
      const obj = { id: 1, name: 'test', extra: true }
      TestAssertions.assertMatches(obj, { id: 1, name: 'test' })
    })
  })

  describe('Utilities', () => {
    it('should delay execution', async () => {
      const start = Date.now()
      await delay(100)
      expect(Date.now() - start).toBeGreaterThanOrEqual(90)
    })

    it('should create event mocks', () => {
      const event = createEvent('click', { clientX: 100, clientY: 200 })
      expect(event.type).toBe('click')
      expect(event.clientX).toBe(100)
      expect(event.clientY).toBe(200)

      event.preventDefault()
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should wait for conditions', async () => {
      let flag = false
      setTimeout(() => { flag = true }, 50)

      await waitFor(() => flag)
      expect(flag).toBe(true)
    })

    it('should timeout on conditions', async () => {
      await expect(
        waitFor(() => false, { timeout: 100 })
      ).rejects.toThrow(TimeoutError)
    })

    it('should create deferred promises', async () => {
      const deferred = createDeferred<string>()

      setTimeout(() => {
        deferred.resolve('success')
      }, 50)

      const result = await deferred.promise
      expect(result).toBe('success')
    })

    it('should handle deferred rejections', async () => {
      const deferred = createDeferred<never>()

      setTimeout(() => {
        deferred.reject(new Error('test error'))
      }, 50)

      await expect(deferred.promise).rejects.toThrow('test error')
    })
  })

  describe('Error Handling', () => {
    it('should create timeout errors', () => {
      const error = new TimeoutError('test timeout')
      expect(error.name).toBe('TimeoutError')
      expect(error.message).toBe('test timeout')
    })

    it('should create assertion errors', () => {
      const error = new AssertionError('test assertion')
      expect(error.name).toBe('AssertionError')
      expect(error.message).toBe('test assertion')
    })
  })
})
