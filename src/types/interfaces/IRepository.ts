import type { Result } from '../errors'

/**
 * Generic repository interface
 * @template T - The entity type
 * @template K - The create input type (defaults to T)
 * @template U - The update input type (defaults to Partial<T>)
 */
export interface IRepository<T, K = T, U = Partial<T>> {
  /**
   * Creates a new entity
   * @param data - The data to create the entity with
   */
  create(data: K): Promise<Result<T>>

  /**
   * Updates an existing entity
   * @param id - The entity ID
   * @param data - The data to update
   */
  update(id: string, data: U): Promise<Result<T>>

  /**
   * Deletes an entity
   * @param id - The entity ID
   */
  delete(id: string): Promise<Result<void>>

  /**
   * Finds entities by filter
   * @param filter - The filter criteria
   */
  find(filter: Partial<T>): Promise<Result<T[]>>

  /**
   * Finds an entity by ID
   * @param id - The entity ID
   */
  findById(id: string): Promise<Result<T | null>>

  /**
   * Gets all entities
   */
  findAll(): Promise<Result<T[]>>
}
