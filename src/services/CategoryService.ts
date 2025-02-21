import { useViajeStore } from '../stores/viaje-store'
import { computed, ComputedRef } from 'vue'
import type { Category, Pilar } from '../types/viaje'
import { storeToRefs } from 'pinia'

const DEBUG = process.env.NODE_ENV === 'development'

export class CategoryServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CategoryServiceError'
  }
}

export class CategoryService {
  private store = useViajeStore()
  private readonly DEFAULT_PILARS = ['Vision', 'Proposito', 'Creencias', 'Estrategias']

  // Get store refs for computed values
  private storeRefs = storeToRefs(this.store)

  getCategories(): ComputedRef<Category[]> {
    return computed(() => this.store.categories)
  }

  getCategoryByName(categoryName: string): Category | undefined {
    if (!categoryName) {
      throw new CategoryServiceError('El nombre de la categoría es requerido')
    }

    if (DEBUG) console.log('Buscando categoría:', categoryName)
    const category = this.store.categories.find(c => c.name === categoryName)

    if (DEBUG) {
      console.log('Categorías disponibles:', this.store.categories.map(c => c.name))
      console.log('Categoría encontrada:', category?.name)
    }

    return category
  }

  addCategory(categoryName: string, initialPilar: Pilar): void {
    if (DEBUG) console.log('Agregando categoría:', categoryName, 'con pilar inicial:', initialPilar)

    if (!categoryName || !initialPilar) {
      throw new CategoryServiceError('El nombre de la categoría y el pilar inicial son requeridos')
    }

    const existingCategory = this.getCategoryByName(categoryName)
    if (existingCategory) {
      throw new CategoryServiceError(`La categoría ${categoryName} ya existe`)
    }

    const pilars: Pilar[] = this.DEFAULT_PILARS.map(pilarName => ({
      name: pilarName,
      sentences: pilarName === initialPilar.name ? [...initialPilar.sentences] : []
    }))

    if (DEBUG) console.log('Creando categoría con pilares:', pilars)
    const newCategory: Category = {
      name: categoryName,
      pilars
    }
    this.store.addCategory(newCategory)
  }

  initializeDefaultCategories() {
    if (DEBUG) console.log('Inicializando categorías por defecto')
    const defaultCategories = [
      'Salud',
      'Personalidad',
      'Intelecto',
      'Carrera',
      'Finanzas',
      'CalidadDeVida',
      'Emocionalidad',
      'Relaciones'
    ]

    const initialPilar: Pilar = {
      name: 'Vision',
      sentences: []
    }

    let hasNewCategories = false
    for (const categoryName of defaultCategories) {
      try {
        if (!this.getCategoryByName(categoryName)) {
          if (DEBUG) console.log('Agregando categoría por defecto:', categoryName)
          this.addCategory(categoryName, initialPilar)
          hasNewCategories = true
        }
      } catch (error) {
        console.error(`Error al inicializar categoría ${categoryName}:`, error)
      }
    }

    if (DEBUG) {
      console.log('Categorías inicializadas, cambios pendientes:', this.storeRefs.cambiosSinGuardar.value)
    }

    return hasNewCategories
  }

  getPilarsByCategory(categoryName: string): Pilar[] {
    const category = this.getCategoryByName(categoryName)
    if (!category) {
      throw new CategoryServiceError(`No se encontró la categoría ${categoryName}`)
    }
    return category.pilars
  }

  getPilarByName(categoryName: string, pilarName: string): Pilar | undefined {
    if (DEBUG) console.log('Obteniendo pilar:', pilarName, 'de categoría:', categoryName)
    const category = this.getCategoryByName(categoryName)
    if (!category) {
      throw new CategoryServiceError(`No se encontró la categoría ${categoryName}`)
    }
    return category.pilars.find(p => p.name === pilarName)
  }

  addSentence(categoryName: string, pilarName: string, sentence: string) {
    if (!sentence?.trim()) {
      throw new CategoryServiceError('La declaración no puede estar vacía')
    }

    if (DEBUG) console.log('Agregando declaración a:', categoryName, pilarName)
    const category = this.getCategoryByName(categoryName)

    if (!category) {
      this.addCategory(categoryName, { name: pilarName, sentences: [] })
    }

    this.store.addSentence(categoryName, pilarName, sentence.trim())
    if (DEBUG) console.log('Cambios después de agregar:', this.storeRefs.cambiosSinGuardar.value)
  }

  editSentence(categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) {
    if (!sentence?.trim()) {
      throw new CategoryServiceError('La declaración no puede estar vacía')
    }

    if (DEBUG) console.log('Editando declaración en:', categoryName, pilarName)
    const pilar = this.getPilarByName(categoryName, pilarName)

    if (!pilar) {
      throw new CategoryServiceError(`No se encontró el pilar ${pilarName} en la categoría ${categoryName}`)
    }

    if (sentenceIndex < 0 || sentenceIndex >= pilar.sentences.length) {
      throw new CategoryServiceError('Índice de declaración inválido')
    }

    this.store.editSentence(categoryName, pilarName, sentenceIndex, sentence.trim())
    if (DEBUG) console.log('Cambios después de editar:', this.storeRefs.cambiosSinGuardar.value)
  }

  deleteSentence(categoryName: string, pilarName: string, sentenceIndex: number) {
    if (DEBUG) console.log('Eliminando declaración de:', categoryName, pilarName)
    const pilar = this.getPilarByName(categoryName, pilarName)

    if (!pilar) {
      throw new CategoryServiceError(`No se encontró el pilar ${pilarName} en la categoría ${categoryName}`)
    }

    if (sentenceIndex < 0 || sentenceIndex >= pilar.sentences.length) {
      throw new CategoryServiceError('Índice de declaración inválido')
    }

    this.store.deleteSentence(categoryName, pilarName, sentenceIndex)
    if (DEBUG) console.log('Cambios después de eliminar:', this.storeRefs.cambiosSinGuardar.value)
  }

  getSelectedCategory() {
    return computed(() => this.storeRefs.categoriaSeleccionada.value)
  }

  setSelectedCategory(categoryName: string) {
    if (!categoryName) {
      throw new CategoryServiceError('El nombre de la categoría es requerido')
    }
    if (DEBUG) console.log('Seleccionando categoría:', categoryName)
    this.store.setCategoriaSeleccionada(categoryName)
  }

  getSelectedPilar() {
    return computed(() => this.storeRefs.pilarSeleccionado.value)
  }

  setSelectedPilar(pilarName: string) {
    if (!pilarName) {
      throw new CategoryServiceError('El nombre del pilar es requerido')
    }
    if (DEBUG) console.log('Seleccionando pilar:', pilarName)
    this.store.setPilarSeleccionado(pilarName)
  }

  hasPendingChanges() {
    return computed(() => this.storeRefs.hasPendingChanges.value)
  }

  async saveChanges() {
    if (DEBUG) console.log('Guardando cambios, pendientes:', this.storeRefs.cambiosSinGuardar.value)

    if (this.storeRefs.isContadorCero.value) {
      if (DEBUG) console.log('No hay cambios que guardar')
      return
    }

    try {
      await this.store.guardarCambiosFirebase()
      if (DEBUG) console.log('Cambios guardados exitosamente')
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      throw new CategoryServiceError(
        error instanceof Error ? error.message : 'Error desconocido al guardar cambios'
      )
    }
  }

  async loadCategories() {
    if (DEBUG) console.log('Cargando categorías')
    if (!this.storeRefs.datosCargados.value) {
      try {
        await this.store.cargaInicialColeccionFirebase()
        const hasNewCategories = this.initializeDefaultCategories()
        if (hasNewCategories) {
          if (DEBUG) console.log('Guardando nuevas categorías por defecto')
          await this.saveChanges()
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        throw new CategoryServiceError(
          error instanceof Error ? error.message : 'Error desconocido al cargar categorías'
        )
      }
    }
  }

  getAvailablePilars() {
    return [...this.DEFAULT_PILARS]
  }
}
