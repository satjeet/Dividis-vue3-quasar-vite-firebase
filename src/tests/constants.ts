// Test IDs
export const TEST_IDS = {
  SENTENCE: 'test-sentence-id',
  CATEGORY: 'test-category-id',
  PILAR: 'test-pilar-id',
  USER: 'test-user-id',
  COLLECTION: 'test-collection',
  DOCUMENT: 'test-document'
} as const

// Test dates
export const TEST_DATES = {
  NOW: new Date('2024-01-01T00:00:00.000Z'),
  PAST: new Date('2023-01-01T00:00:00.000Z'),
  FUTURE: new Date('2025-01-01T00:00:00.000Z')
} as const

// Test data
export const TEST_DATA = {
  USER: {
    id: TEST_IDS.USER,
    email: 'test@example.com'
  },
  SENTENCE: {
    id: TEST_IDS.SENTENCE,
    content: 'Test sentence content',
    categoryId: TEST_IDS.CATEGORY,
    pilarId: TEST_IDS.PILAR,
    userId: TEST_IDS.USER,
    createdAt: TEST_DATES.NOW,
    updatedAt: TEST_DATES.NOW,
    metadata: {}
  }
} as const

// Test collections
export const TEST_COLLECTIONS = {
  SENTENCES: 'sentences',
  CATEGORIES: 'categories',
  PILARS: 'pilars',
  USERS: 'users'
} as const

// Test paths
export const TEST_PATHS = {
  SENTENCES: `/${TEST_COLLECTIONS.SENTENCES}`,
  CATEGORIES: `/${TEST_COLLECTIONS.CATEGORIES}`,
  PILARS: `/${TEST_COLLECTIONS.PILARS}`,
  USERS: `/${TEST_COLLECTIONS.USERS}`,
  SENTENCE: (id = TEST_IDS.SENTENCE) => `/${TEST_COLLECTIONS.SENTENCES}/${id}`,
  CATEGORY: (id = TEST_IDS.CATEGORY) => `/${TEST_COLLECTIONS.CATEGORIES}/${id}`,
  PILAR: (id = TEST_IDS.PILAR) => `/${TEST_COLLECTIONS.PILARS}/${id}`,
  USER: (id = TEST_IDS.USER) => `/${TEST_COLLECTIONS.USERS}/${id}`
} as const

// Test errors
export const TEST_ERRORS = {
  NOT_FOUND: 'Entity not found',
  VALIDATION: 'Validation error',
  AUTHENTICATION: 'Authentication error',
  AUTHORIZATION: 'Authorization error',
  SERVER: 'Server error',
  NETWORK: 'Network error',
  UNKNOWN: 'Unknown error'
} as const

// Test status
export const TEST_STATUS = {
  SUCCESS: true,
  FAILURE: false
} as const

// Export all constants
export const Constants = {
  IDS: TEST_IDS,
  DATES: TEST_DATES,
  DATA: TEST_DATA,
  COLLECTIONS: TEST_COLLECTIONS,
  PATHS: TEST_PATHS,
  ERRORS: TEST_ERRORS,
  STATUS: TEST_STATUS
} as const
