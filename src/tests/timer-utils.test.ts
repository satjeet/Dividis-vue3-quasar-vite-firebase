import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createTimerPromise,
  createDelayedPromise,
  createBatchedPromises,
  useTimers,
  createControlledPromise,
  resetTimerState,
  type TimerControls
} from './timer-utils'

describe('Timer Utilities', () => {
  let timers: TimerControls

  beforeEach(() => {
    resetTimerState()
    timers = useTimers()
  })

  afterEach(() => {
    resetTimerState()
  })

  describe('Timer Promises', () => {
    test('createTimerPromise resolves after delay', async () => {
      const promise = createTimerPromise(1000, 'test')
      timers.advance(1000)
      const result = await promise
      expect(result).toBe('test')
    })

    test('createDelayedPromise resolves after delay', async () => {
      const promise = createDelayedPromise(1000, 'test')
      timers.advance(1000)
      const result = await promise
      expect(result).toBe('test')
    })

    test('createBatchedPromises resolves in sequence', async () => {
      const values = [1, 2, 3]
      const delay = 1000
      const promise = createBatchedPromises(values, delay)
      timers.advance(delay * values.length)
      const results = await promise
      expect(results).toEqual(values)
    })
  })

  describe('Controlled Promises', () => {
    test('allows manual resolution', async () => {
      const { promise, resolve } = createControlledPromise<string>()
      resolve('test')
      const result = await promise
      expect(result).toBe('test')
    })

    test('allows manual rejection', async () => {
      const { promise, reject } = createControlledPromise<string>()
      const error = new Error('test error')
      reject(error)
      await expect(promise).rejects.toThrow('test error')
    })

    test('tracks pending state', () => {
      const { pending, resolve } = createControlledPromise<string>()
      expect(pending).toBe(true)
      resolve('test')
      expect(pending).toBe(false)
    })
  })

  describe('Timer Controls', () => {
    test('advance processes timers up to delay', () => {
      const times: number[] = []
      const startTime = Date.now()

      setTimeout(() => times.push(Date.now() - startTime), 1000)
      setTimeout(() => times.push(Date.now() - startTime), 2000)

      timers.advance(2000)
      expect(times).toEqual([1000, 2000])
    })

    test('runAll processes all pending timers', () => {
      const executed: number[] = []
      setTimeout(() => executed.push(1), 1000)
      setTimeout(() => executed.push(2), 2000)

      timers.runAll()
      expect(executed).toEqual([1, 2])
    })

    test('runPending processes only due timers', () => {
      const executed: number[] = []
      setTimeout(() => executed.push(1), 1000)
      setTimeout(() => executed.push(2), 2000)

      timers.advance(1000)
      timers.runPending()
      expect(executed).toEqual([1])
    })

    test('reset cleans up timers', () => {
      const callback = vi.fn()
      setTimeout(callback, 1000)
      timers.reset()
      timers.advance(1000)
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
