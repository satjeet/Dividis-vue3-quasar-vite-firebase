import { auth, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { IViajeRepository } from '../types/interfaces/IViajeRepository'
import type { Category, Pilar } from '../types/viaje'

interface FirestoreCategory {
  name: string
  pilars: Array<{
    name: string
    sentences: string[]
  }>
}

interface FirestoreData {
  categories: FirestoreCategory[]
}

export class ViajeFirebaseRepository implements IViajeRepository {
  private getDocRef(userId: string) {
    return doc(db, 'usuarios', userId, 'datos', 'categories')
  }

  private validateData(categories: Category[]): string | null {
    if (!Array.isArray(categories)) {
      return 'Categories must be an array'
    }

    for (const category of categories) {
      if (!category.name) {
        return 'Category name is required'
      }

      if (!Array.isArray(category.pilars)) {
        return `Pilars must be an array for category ${category.name}`
      }

      for (const pilar of category.pilars) {
        if (!pilar.name) {
          return `Pilar name is required in category ${category.name}`
        }

        if (!Array.isArray(pilar.sentences)) {
          return `Sentences must be an array in pilar ${pilar.name} of category ${category.name}`
        }
      }
    }

    return null
  }

  async saveCategories(userId: string, categoriesToUpdate: Category[]): Promise<void> {
    try {
      console.log('Starting save operation for categories:', categoriesToUpdate.map(c => c.name))

      // Validate input data
      const validationError = this.validateData(categoriesToUpdate)
      if (validationError) {
        console.error('Validation error:', validationError)
        throw new Error(validationError)
      }

      const docRef = this.getDocRef(userId)
      const docSnap = await getDoc(docRef)
      let currentCategories: Category[] = []

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreData
        currentCategories = data.categories.map(cat => ({
          name: cat.name,
          pilars: cat.pilars.map(p => ({
            name: p.name,
            sentences: [...p.sentences]
          }))
        }))
        console.log('Current categories:', currentCategories.map(c => c.name))
      }

      // Update or add categories
      for (const updatedCategory of categoriesToUpdate) {
        const index = currentCategories.findIndex((c: Category) => c.name === updatedCategory.name)
        if (index !== -1) {
          // Update existing category
          console.log(`Updating category: ${updatedCategory.name}`)
          currentCategories[index] = {
            name: updatedCategory.name,
            pilars: updatedCategory.pilars.map(p => ({
              name: p.name,
              sentences: [...p.sentences]
            }))
          }
        } else {
          // Add new category
          console.log(`Adding new category: ${updatedCategory.name}`)
          currentCategories.push({
            name: updatedCategory.name,
            pilars: updatedCategory.pilars.map(p => ({
              name: p.name,
              sentences: [...p.sentences]
            }))
          })
        }
      }

      // Save all categories at once
      console.log('Saving all categories:', currentCategories.map(c => c.name))
      const dataToSave: FirestoreData = {
        categories: currentCategories
      }
      await setDoc(docRef, dataToSave, { merge: false })
      console.log('Save operation completed successfully')

    } catch (error) {
      console.error('Error in saveCategories:', error)
      console.error('Stack trace:', (error as Error).stack)
      throw error
    }
  }

  async loadCategories(userId: string): Promise<Category[] | null> {
    try {
      console.log('Loading categories for user:', userId)
      const docRef = this.getDocRef(userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreData
        const categories: Category[] = data.categories.map(categoryData => ({
          name: categoryData.name,
          pilars: categoryData.pilars.map(pilarData => ({
            name: pilarData.name,
            sentences: pilarData.sentences || []
          }))
        }))
        console.log('Loaded categories:', categories.map(c => c.name))
        return categories
      }

      console.log('No categories found for user')
      return null
    } catch (error) {
      console.error('Error in loadCategories:', error)
      console.error('Stack trace:', (error as Error).stack)
      throw error
    }
  }
}
