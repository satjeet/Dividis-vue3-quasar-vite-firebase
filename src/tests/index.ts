// Export test utilities
export * from './utils'
export * from './matchers'
export * from './constants'

// Export assertion helpers
export {
  expectSuccess,
  expectError,
  expectCalled,
  expectCalledTimes,
  expectNotCalled,
  expectKeys,
  expectDateInRange,
  expectRejects,
  expectErrorInstance
} from './assertions'

// Export test helpers
export {
  assertSuccess,
  assertError,
  assertDate,
  assertProperties,
  assertContains,
  mockAsync,
  mockError,
  TestData,
  waitFor,
  wait
} from './utils'

// Export factory functions
export {
  TestFirebaseFactory,
  TestSentenceFactory,
  TestDocumentFactory
} from './factories'

// Re-export vitest utilities
export {
  vi,
  describe,
  test,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach
} from 'vitest'

// Export mock types
export type {
  MockDocumentRef,
  MockDocumentSnapshot,
  MockQuerySnapshot,
  MockMetadata,
  MockTimestamp,
  TestFactoryDefaults,
  TestFactoryOptions,
  ViMock,
  RouteMock,
  FirebaseAuthMock,
  MediaQueryListMock,
  LocalStorageMock,
  CSSMock,
  ComputedStyleMock
} from './types'

// Export helper types
export type {
  TestValue,
  TestCallback,
  TestPredicate
} from './utils'
