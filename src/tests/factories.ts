import { vi } from 'vitest'
import type { Timestamp } from 'firebase/firestore'
import type { DocumentData } from '@firebase/firestore-types'
import type { Sentence, SentenceInput, SentenceUpdate, SentenceFilter } from '../types/sentence'
import { type Result } from '../types/errors'
import { mockResult, mockErrorResult } from './helpers'

// Mock Timestamp type that matches Firebase's Timestamp
type MockTimestamp = {
  seconds: number
  nanoseconds: number
  toDate: () => Date
  toMillis: () => number
  isEqual: (other: MockTimestamp) => boolean
  valueOf: () => number
  toJSON: () => { seconds: number; nanoseconds: number }
}

/**
 * Factory to create test documents
 */
export class TestDocumentFactory {
  static createTimestamp(date = '2024-01-01'): MockTimestamp {
    const timestamp = new Date(date).getTime() / 1000
    return {
      seconds: timestamp,
      nanoseconds: 0,
      toDate: () => new Date(timestamp * 1000),
      toMillis: () => timestamp * 1000,
      isEqual: () => false,
      valueOf: () => timestamp,
      toJSON: () => ({ seconds: timestamp, nanoseconds: 0 })
    }
  }

  static createDocumentData(data: Record<string, any>): DocumentData {
    return {
      ...data,
      createdAt: this.createTimestamp(),
      updatedAt: this.createTimestamp()
    }
  }
}

/**
 * Factory to create test sentences
 */
export class TestSentenceFactory {
  static createSentence(overrides?: Partial<Sentence>): Sentence {
    return {
      id: 'test-sentence-id',
      content: 'Test sentence content',
      categoryId: 'test-category-id',
      pilarId: 'test-pilar-id',
      userId: 'test-user-id',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      metadata: {},
      ...overrides
    }
  }

  static createInput(overrides?: Partial<SentenceInput>): SentenceInput {
    return {
      content: 'Test sentence content',
      categoryId: 'test-category-id',
      pilarId: 'test-pilar-id',
      metadata: {},
      ...overrides
    }
  }

  static createUpdate(overrides?: Partial<SentenceUpdate>): SentenceUpdate {
    return {
      content: 'Updated test sentence content',
      metadata: {},
      ...overrides
    }
  }

  static createFilter(overrides?: Partial<SentenceFilter>): SentenceFilter {
    return {
      categoryId: 'test-category-id',
      pilarId: 'test-pilar-id',
      userId: 'test-user-id',
      ...overrides
    }
  }

  static createResult(overrides?: Partial<Sentence>): Result<Sentence> {
    return mockResult(this.createSentence(overrides))
  }

  static createListResult(count = 3, overrides?: Partial<Sentence>): Result<Sentence[]> {
    return mockResult(
      Array.from({ length: count }, (_, index) =>
        this.createSentence({
          id: `test-sentence-${index + 1}`,
          ...overrides
        })
      )
    )
  }

  static createErrorResult<T = Sentence>(message = 'Test error'): Result<T> {
    return mockErrorResult(message)
  }

  static createDocumentData(overrides?: Partial<Sentence>): DocumentData {
    const data = this.createSentence(overrides)
    const { id, ...rest } = data
    return TestDocumentFactory.createDocumentData(rest)
  }
}

/**
 * Factory to create test Firebase documents
 */
export class TestFirebaseFactory {
  static createDocRef(id = 'test-doc-id') {
    return {
      id,
      path: `test-collection/${id}`,
      collection: vi.fn(),
      doc: vi.fn()
    }
  }

  static createDocSnapshot(id: string, data: DocumentData) {
    return {
      id,
      ref: this.createDocRef(id),
      data: () => data,
      exists: () => true,
      metadata: {
        hasPendingWrites: false,
        fromCache: false
      }
    }
  }

  static createQuerySnapshot(docs: Array<{ id: string; data: DocumentData }>) {
    return {
      docs: docs.map(({ id, data }) => this.createDocSnapshot(id, data)),
      empty: docs.length === 0,
      size: docs.length,
      forEach: vi.fn(),
      docChanges: vi.fn(() => []),
      metadata: {
        hasPendingWrites: false,
        fromCache: false
      }
    }
  }
}

/**
 * Factory to create test MockFn responses
 */
export class TestMockFactory {
  static createMockFn() {
    return vi.fn()
  }

  static createMockPromise<T>(value: T) {
    return vi.fn().mockResolvedValue(value)
  }

  static createMockRejection(error: Error) {
    return vi.fn().mockRejectedValue(error)
  }

  static createMockImplementation<T>(implementation: (...args: any[]) => T) {
    return vi.fn().mockImplementation(implementation)
  }
}
