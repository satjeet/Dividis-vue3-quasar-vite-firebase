import { vi } from 'vitest'
import type { DocumentData } from '@firebase/firestore-types'
import type {
  MockDocumentRef,
  MockCollectionRef,
  MockDocumentSnapshot,
  MockQuerySnapshot,
  MockQueryDocumentSnapshot,
  MockMetadata
} from '../types'

export class TestFirebaseFactory {
  static createMetadata(hasPendingWrites = false, fromCache = false): MockMetadata {
    return {
      hasPendingWrites,
      fromCache,
      isEqual: (other: MockMetadata) =>
        hasPendingWrites === other.hasPendingWrites && fromCache === other.fromCache
    }
  }

  static createCollectionRef<T = DocumentData>(collectionId = 'test-collection'): MockCollectionRef<T> {
    return {
      id: collectionId,
      path: collectionId,
      parent: null,
      doc: vi.fn(),
      type: 'collection'
    }
  }

  static createDocRef<T = DocumentData>(
    id = 'test-doc-id',
    collection = this.createCollectionRef<T>()
  ): MockDocumentRef<T> {
    return {
      id,
      path: `${collection.path}/${id}`,
      parent: collection,
      collection: vi.fn(),
      doc: vi.fn(),
      type: 'document'
    }
  }

  static createDocumentSnapshot<T = DocumentData>(
    id: string,
    data: T | undefined,
    exists = true
  ): MockDocumentSnapshot<T> {
    const ref = this.createDocRef<T>(id)
    return {
      id,
      ref,
      data: () => data,
      exists: function(): this is MockQueryDocumentSnapshot<T> {
        return exists
      },
      metadata: this.createMetadata(),
      get: (fieldPath: string) => data && (data as any)[fieldPath]
    }
  }

  static createQueryDocumentSnapshot<T = DocumentData>(
    id: string,
    data: T
  ): MockQueryDocumentSnapshot<T> {
    const base = this.createDocumentSnapshot(id, data, true)
    return {
      ...base,
      data: () => data
    }
  }

  static createQuerySnapshot<T = DocumentData>(
    docs: Array<{ id: string; data: T }>
  ): MockQuerySnapshot<T> {
    return {
      docs: docs.map(({ id, data }) => this.createQueryDocumentSnapshot(id, data)),
      empty: docs.length === 0,
      size: docs.length,
      forEach: vi.fn(),
      docChanges: vi.fn(() => []),
      metadata: this.createMetadata()
    }
  }

  static createEmptyQuerySnapshot<T = DocumentData>(): MockQuerySnapshot<T> {
    return this.createQuerySnapshot([])
  }
}
