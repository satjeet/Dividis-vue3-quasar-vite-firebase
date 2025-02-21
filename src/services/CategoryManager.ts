import type { ICategoryManager } from '../types/interfaces/ICategoryManager'
import type { Category, Pilar } from '../types/viaje'

export class CategoryManager implements ICategoryManager {
  private categories: Category[]

  constructor(initialCategories: Category[] = []) {
    this.categories = initialCategories
  }

  addCategory(categoryName: string, pilar: Pilar): Category {
    const newCategory: Category = {
      name: categoryName,
      pilars: [pilar]
    }
    this.categories.push(newCategory)
    return newCategory
  }

  addSentence(categoryName: string, pilarName: string, sentence: string): void {
    const category = this.getCategory(categoryName)
    const categoryIndex = this.categories.findIndex(c => c.name === categoryName)

    if (!category) {
      this.categories.push({
        name: categoryName,
        pilars: [{
          name: pilarName,
          sentences: [sentence]
        }]
      })
      return
    }

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) {
      this.categories[categoryIndex].pilars.push({
        name: pilarName,
        sentences: [sentence]
      })
      return
    }

    if (!pilar.sentences.includes(sentence)) {
      pilar.sentences.push(sentence)
    }
  }

  editSentence(categoryName: string, pilarName: string, sentenceIndex: number, sentence: string): void {
    const category = this.getCategory(categoryName)
    if (!category) return

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) return

    if (sentenceIndex >= 0 && sentenceIndex < pilar.sentences.length) {
      pilar.sentences[sentenceIndex] = sentence
    }
  }

  deleteSentence(categoryName: string, pilarName: string, sentenceIndex: number): void {
    const category = this.getCategory(categoryName)
    if (!category) return

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) return

    if (sentenceIndex >= 0 && sentenceIndex < pilar.sentences.length) {
      pilar.sentences.splice(sentenceIndex, 1)
    }
  }

  getCategory(categoryName: string): Category | undefined {
    return this.categories.find(category => category.name === categoryName)
  }

  getCategories(): Category[] {
    return this.categories
  }

  setCategories(categories: Category[]): void {
    this.categories = categories
  }
}
