import { TestFirebaseFactory } from './firebase'

// Re-export the factory class
export { TestFirebaseFactory }

// Export convenience factory functions
export const createMockMetadata = TestFirebaseFactory.createMetadata
export const createMockCollectionRef = TestFirebaseFactory.createCollectionRef
export const createMockDocRef = TestFirebaseFactory.createDocRef
export const createMockDocumentSnapshot = TestFirebaseFactory.createDocumentSnapshot
export const createMockQueryDocumentSnapshot = TestFirebaseFactory.createQueryDocumentSnapshot
export const createMockQuerySnapshot = TestFirebaseFactory.createQuerySnapshot
export const createEmptyMockQuerySnapshot = TestFirebaseFactory.createEmptyQuerySnapshot

// Factory namespace object
export const Firebase = {
  createMetadata: createMockMetadata,
  createCollectionRef: createMockCollectionRef,
  createDocRef: createMockDocRef,
  createDocumentSnapshot: createMockDocumentSnapshot,
  createQueryDocumentSnapshot: createMockQueryDocumentSnapshot,
  createQuerySnapshot: createMockQuerySnapshot,
  createEmptyQuerySnapshot: createEmptyMockQuerySnapshot,

  // Convenience methods
  collection: createMockCollectionRef,
  doc: createMockDocRef,
  snapshot: createMockDocumentSnapshot,
  query: createMockQuerySnapshot,
  empty: createEmptyMockQuerySnapshot
}

// Export all from the types module
export * from '../types'
