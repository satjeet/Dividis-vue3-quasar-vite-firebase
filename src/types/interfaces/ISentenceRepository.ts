import type { Sentence, SentenceInput, SentenceFilter, SentenceUpdate, SentenceList } from '../sentence'
import type { Result } from '../errors'
import type { IRepository } from './IRepository'

/**
 * Repository interface for managing Sentences
 */
export interface ISentenceRepository extends IRepository<Sentence, SentenceInput, SentenceUpdate> {
  /**
   * Finds sentences based on specific filters
   * @param filter - Filter criteria including categoryId, pilarId, and userId
   */
  find(filter: SentenceFilter): Promise<Result<SentenceList>>

  /**
   * Updates a sentence with specific update fields
   * @param id - The sentence ID
   * @param data - The fields to update
   */
  update(id: string, data: SentenceUpdate): Promise<Result<Sentence>>

  /**
   * Creates a new sentence
   * @param data - The sentence input data
   */
  create(data: SentenceInput): Promise<Result<Sentence>>

  /**
   * Deletes a sentence by ID
   * @param id - The sentence ID
   */
  delete(id: string): Promise<Result<void>>

  /**
   * Finds a sentence by ID
   * @param id - The sentence ID
   */
  findById(id: string): Promise<Result<Sentence | null>>

  /**
   * Gets all sentences
   */
  findAll(): Promise<Result<SentenceList>>
}

/** Type to represent available repository methods */
export type SentenceRepositoryMethod = keyof ISentenceRepository
