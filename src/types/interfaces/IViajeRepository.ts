import type { Category } from '../viaje'

export interface IViajeRepository {
  saveCategories(userId: string, categories: Category[]): Promise<void>
  loadCategories(userId: string): Promise<Category[] | null>
}
