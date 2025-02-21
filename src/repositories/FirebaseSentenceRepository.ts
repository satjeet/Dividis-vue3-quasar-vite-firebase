import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp, DocumentData } from 'firebase/firestore'
import { db } from '../firebase'
import type { ISentenceRepository } from '../types/interfaces/ISentenceRepository'
import type { Sentence, SentenceInput, SentenceFilter, SentenceUpdate, SentenceList } from '../types/sentence'
import { createSuccessResult, createErrorResult, type Result, RepositoryError, NotFoundError } from '../types/errors'

type FirestoreSentence = Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Firebase implementation of the Sentence repository
 */
export class FirebaseSentenceRepository implements ISentenceRepository {
  private readonly collectionName = 'sentences'

  /**
   * Maps a Firestore document data to a domain entity
   */
  private mapDocumentData(data: DocumentData): Partial<FirestoreSentence> {
    const { id, ...rest } = data as any
    return rest
  }

  /**
   * Maps a Firestore timestamp to a JavaScript Date
   */
  private mapTimestampToDate(data: Partial<FirestoreSentence>): Partial<Sentence> {
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || undefined,
      updatedAt: data.updatedAt?.toDate?.() || undefined
    }
  }

  /**
   * Maps an entity to include its ID and formatted dates
   */
  private mapEntity(id: string, data: DocumentData): Sentence {
    const firestoreData = this.mapDocumentData(data)
    const domainData = this.mapTimestampToDate(firestoreData)

    return {
      id,
      content: domainData.content || '',
      ...domainData
    } as Sentence
  }

  async create(data: SentenceInput): Promise<Result<Sentence>> {
    try {
      const now = Timestamp.now()
      const firestoreData: Partial<FirestoreSentence> = {
        ...data,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.collectionName), firestoreData)
      return createSuccessResult(this.mapEntity(docRef.id, { ...data, createdAt: now, updatedAt: now }))
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to create sentence', error as Error))
    }
  }

  async update(id: string, data: SentenceUpdate): Promise<Result<Sentence>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return createErrorResult(new NotFoundError(`Sentence with id ${id} not found`))
      }

      const now = Timestamp.now()
      const updateData = {
        ...data,
        updatedAt: now
      }

      await updateDoc(docRef, updateData)
      const currentData = docSnap.data()

      return createSuccessResult(this.mapEntity(id, {
        ...currentData,
        ...data,
        updatedAt: now
      }))
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to update sentence', error as Error))
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return createErrorResult(new NotFoundError(`Sentence with id ${id} not found`))
      }

      await deleteDoc(docRef)
      return createSuccessResult(undefined)
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to delete sentence', error as Error))
    }
  }

  async find(filter: SentenceFilter): Promise<Result<SentenceList>> {
    try {
      const conditions = []

      if (filter.categoryId) {
        conditions.push(where('categoryId', '==', filter.categoryId))
      }
      if (filter.pilarId) {
        conditions.push(where('pilarId', '==', filter.pilarId))
      }
      if (filter.userId) {
        conditions.push(where('userId', '==', filter.userId))
      }

      const q = query(collection(db, this.collectionName), ...conditions)
      const querySnapshot = await getDocs(q)

      const sentences = querySnapshot.docs.map(doc =>
        this.mapEntity(doc.id, doc.data())
      )

      return createSuccessResult(sentences)
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to find sentences', error as Error))
    }
  }

  async findById(id: string): Promise<Result<Sentence | null>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return createSuccessResult(null)
      }

      return createSuccessResult(this.mapEntity(docSnap.id, docSnap.data()))
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to find sentence by id', error as Error))
    }
  }

  async findAll(): Promise<Result<SentenceList>> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName))
      const sentences = querySnapshot.docs.map(doc =>
        this.mapEntity(doc.id, doc.data())
      )

      return createSuccessResult(sentences)
    } catch (error) {
      return createErrorResult(new RepositoryError('Failed to find all sentences', error as Error))
    }
  }
}
