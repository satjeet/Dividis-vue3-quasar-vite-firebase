import type { Category, Pilar } from '../viaje'

export interface ICategoryManager {
  addCategory(categoryName: string, pilar: Pilar): Category
  addSentence(categoryName: string, pilarName: string, sentence: string): void
  editSentence(categoryName: string, pilarName: string, sentenceIndex: number, sentence: string): void
  deleteSentence(categoryName: string, pilarName: string, sentenceIndex: number): void
  getCategory(categoryName: string): Category | undefined
}
