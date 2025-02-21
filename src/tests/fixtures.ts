import type { Sentence, SentenceInput, SentenceUpdate } from '../types/sentence'
import type { Result } from '../types/errors'
import { mockResult, mockErrorResult } from './helpers'

export function createTestSentence(overrides?: Partial<Sentence>): Sentence {
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

export function createTestSentenceInput(overrides?: Partial<SentenceInput>): SentenceInput {
  return {
    content: 'Test sentence content',
    categoryId: 'test-category-id',
    pilarId: 'test-pilar-id',
    metadata: {},
    ...overrides
  }
}

export function createTestSentenceUpdate(overrides?: Partial<SentenceUpdate>): SentenceUpdate {
  return {
    content: 'Updated test sentence content',
    metadata: {},
    ...overrides
  }
}

export function createTestSentenceResult(
  overrides?: Partial<Sentence>
): Result<Sentence> {
  return mockResult(createTestSentence(overrides))
}

export function createTestSentenceListResult(
  count = 3,
  overrides?: Partial<Sentence>
): Result<Sentence[]> {
  return mockResult(
    Array.from({ length: count }, (_, index) =>
      createTestSentence({
        id: `test-sentence-${index + 1}`,
        ...overrides
      })
    )
  )
}

export function createTestSentenceErrorResult(): Result<Sentence> {
  return mockErrorResult('Test sentence error')
}

export function createTestDate(date = '2024-01-01'): Date {
  return new Date(date)
}

export function createTestTimestamp(seconds = 1704067200): { seconds: number; nanoseconds: number } {
  return {
    seconds,
    nanoseconds: 0
  }
}
