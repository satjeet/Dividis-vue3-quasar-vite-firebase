import { vi } from 'vitest'
import type { Timestamp } from 'firebase/firestore'
import type { DocumentData } from '@firebase/firestore-types'

// Basic test types
export interface ViMock {
  fn: ReturnType<typeof vi.fn>
  mock: ReturnType<typeof vi.mock>
}

export interface RouteMock {
  params: Record<string, unknown>
  query: Record<string, unknown>
  path: string
}

export interface FirebaseAuthMock {
  currentUser: {
    uid: string
    email: string
  }
}

// Browser API mocks
export interface MediaQueryListMock {
  matches: boolean
  media: string
  onchange: null
  addListener: ReturnType<typeof vi.fn>
  removeListener: ReturnType<typeof vi.fn>
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
  dispatchEvent: ReturnType<typeof vi.fn>
}

export interface LocalStorageMock {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
  removeItem: ReturnType<typeof vi.fn>
  clear: ReturnType<typeof vi.fn>
  length: number
  key: ReturnType<typeof vi.fn>
}

export interface CSSMock {
  supports: ReturnType<typeof vi.fn>
  escape: ReturnType<typeof vi.fn<(str: string) => string>>
}

export interface ComputedStyleMock {
  getPropertyValue: (prop: string) => string
}

// Firestore mocks
export interface MockTimestamp {
  seconds: number
  nanoseconds: number
  toDate: () => Date
  toMillis: () => number
  isEqual: (other: MockTimestamp) => boolean
  valueOf: () => number
  toJSON: () => { seconds: number; nanoseconds: number }
}

export interface MockMetadata {
  hasPendingWrites: boolean
  fromCache: boolean
  isEqual: (other: MockMetadata) => boolean
}

export interface MockDocumentRef<T = DocumentData> {
  id: string
  path: string
  parent: MockCollectionRef<T>
  collection: ReturnType<typeof vi.fn>
  doc: ReturnType<typeof vi.fn>
  type: 'document'
}

export interface MockCollectionRef<T = DocumentData> {
  id: string
  path: string
  parent: MockDocumentRef<T> | null
  doc: ReturnType<typeof vi.fn>
  type: 'collection'
}

export interface MockDocumentSnapshot<T = DocumentData> {
  id: string
  ref: MockDocumentRef<T>
  data: () => T | undefined
  exists: () => this is MockQueryDocumentSnapshot<T>
  metadata: MockMetadata
  get: (fieldPath: string) => any
}

export interface MockQueryDocumentSnapshot<T = DocumentData> extends Omit<MockDocumentSnapshot<T>, 'data'> {
  data: () => T
}

export interface MockQuerySnapshot<T = DocumentData> {
  docs: MockQueryDocumentSnapshot<T>[]
  empty: boolean
  size: number
  forEach: ReturnType<typeof vi.fn>
  docChanges: ReturnType<typeof vi.fn>
  metadata: MockMetadata
}

// Test factory types
export interface TestFactoryDefaults {
  id?: string
  createdAt?: Date | Timestamp
  updatedAt?: Date | Timestamp
  metadata?: Record<string, any>
}

export interface TestFactoryOptions<T> extends TestFactoryDefaults {
  overrides?: Partial<T>
}
