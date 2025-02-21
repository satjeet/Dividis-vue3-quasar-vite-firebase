import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mockFactory, createAsyncMock, createResponseMock } from '../config/mocks'
import { StorageImpl } from '../config/storage'
import type { Mock } from '../config/types'

/**
 * Example tests demonstrating the usage of test configuration and utilities
 */
describe('Test Configuration Usage Examples', () => {
  // Storage example
  describe('Storage Implementation', () => {
    let storage: StorageImpl

    beforeEach(() => {
      storage = new StorageImpl()
    })

    afterEach(() => {
      storage.clear()
    })

    it('should store and retrieve values', () => {
      storage.setItem('key', 'value')
      expect(storage.getItem('key')).toBe('value')
    })

    it('should handle missing values', () => {
      expect(storage.getItem('nonexistent')).toBeNull()
    })

    it('should track storage size', () => {
      storage.setItem('a', '1')
      storage.setItem('b', '2')
      expect(storage.length).toBe(2)
    })

    it('should enumerate keys', () => {
      storage.setItem('a', '1')
      storage.setItem('b', '2')
      expect(storage.key(0)).toBe('a')
      expect(storage.key(1)).toBe('b')
    })
  })

  // Mock examples
  describe('Mock Utilities', () => {
    it('should create basic mocks', () => {
      const mock = mockFactory<(id: number) => string>()
      mock.mockReturnValue('test')
      expect(mock(1)).toBe('test')
      expect(mock).toHaveBeenCalledWith(1)
    })

    it('should handle async mocks', async () => {
      const mock = mockFactory()
      mock.mockResolvedValue('async value')
      const result = await mock()
      expect(result).toBe('async value')
    })

    it('should create response mocks', async () => {
      const response = createResponseMock()
      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data).toEqual({})
    })

    it('should handle controlled async operations', async () => {
      const asyncMock = createAsyncMock<string>()
      const promise = asyncMock.mock()

      // Control the resolution
      asyncMock.resolve('success')
      const result = await promise
      expect(result).toBe('success')
    })
  })

  // Environment examples
  describe('Environment Features', () => {
    it('should have access to global mocks', () => {
      expect(global.fetch).toBeDefined()
      expect(global.localStorage).toBeDefined()
      expect(global.sessionStorage).toBeDefined()
    })

    it('should handle fetch requests', async () => {
      const mockFetch = global.fetch as Mock
      mockFetch.mockResolvedValue(createResponseMock())

      const response = await fetch('/api/test')
      expect(response.ok).toBe(true)
      await expect(response.json()).resolves.toEqual({})
    })

    it('should handle media queries', () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      expect(mediaQuery.matches).toBe(false)
      expect(mediaQuery.media).toBe('(prefers-color-scheme: dark)')
    })

    it('should persist data in localStorage', () => {
      localStorage.setItem('theme', 'dark')
      expect(localStorage.getItem('theme')).toBe('dark')
      localStorage.clear()
    })
  })

  // Error handling examples
  describe('Error Handling', () => {
    it('should handle rejected promises', async () => {
      const asyncMock = createAsyncMock<never>()
      const promise = asyncMock.mock()

      asyncMock.reject(new Error('Test error'))
      await expect(promise).rejects.toThrow('Test error')
    })

    it('should mock error handlers', () => {
      const errorHandler = mockFactory<(error: Error) => void>()
      const testError = new Error('Test error')
      errorHandler(testError)

      expect(errorHandler).toHaveBeenCalled()
      const [[error]] = errorHandler.mock.calls
      expect(error instanceof Error).toBe(true)
      expect(error.message).toBe('Test error')
    })
  })

  // Type safety examples
  describe('Type Safety', () => {
    interface User {
      id: number
      name: string
    }

    it('should handle typed mocks', () => {
      const userMock = mockFactory<(id: number) => User>()
      userMock.mockReturnValue({ id: 1, name: 'Test' })

      const user = userMock(1)
      expect(user.id).toBe(1)
      expect(user.name).toBe('Test')
    })

    it('should handle typed async mocks', async () => {
      const asyncUserMock = createAsyncMock<User>()
      const promise = asyncUserMock.mock()

      asyncUserMock.resolve({ id: 1, name: 'Test' })
      const user = await promise
      expect(user).toEqual({ id: 1, name: 'Test' })
    })

    it('should validate error objects', () => {
      const error = new Error('Test error')
      expect(error instanceof Error).toBe(true)
      expect(error.name).toBe('Error')
      expect(error.message).toBe('Test error')
    })
  })
})
