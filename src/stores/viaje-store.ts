import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { auth } from '../firebase'
import type { Category } from '../types/viaje'
import type { ViajeStoreState, ViajeStoreGetters, ViajeStoreActions } from '../types/store'
import { ViajeFirebaseRepository } from '../repositories/ViajeFirebaseRepository'
import { ExperienceManager } from '../services/ExperienceManager'

const DEBUG = process.env.NODE_ENV === 'development'

export const useViajeStore = defineStore('viaje-store', () => {
  // Initialize state with reactive refs
  const categories = ref<Category[]>([])
  const cambiosSinGuardar = ref(0)
  const datosCargados = ref(false)
  const categoriaSeleccionada = ref('')
  const pilarSeleccionado = ref('')
  const modifiedCategories = ref(new Set<string>())
  const pilars = ['Vision', 'Proposito', 'Creencias', 'Estrategias']

  // Service instances
  const viajeRepository = new ViajeFirebaseRepository()
  const experienceManager = new ExperienceManager()

  // Getters (computed)
  const isContadorCero = computed(() => cambiosSinGuardar.value === 0)
  const hasPendingChanges = computed(() => !isContadorCero.value)

  // Track changes
  watch(categories, () => {
    cambiosSinGuardar.value = modifiedCategories.value.size
    if (DEBUG) {
      console.log('Categories changed:', categories.value)
      console.log('Modified categories:', Array.from(modifiedCategories.value))
      console.log('Changes pending:', cambiosSinGuardar.value)
    }
  }, { deep: true })

  // Actions
  function setCategoriaSeleccionada(categoria: string) {
    categoriaSeleccionada.value = categoria
  }

  function setPilarSeleccionado(pilar: string) {
    pilarSeleccionado.value = pilar
  }

  function markCategoryAsModified(categoryName: string) {
    if (DEBUG) console.log('Marking category as modified:', categoryName)
    modifiedCategories.value.add(categoryName)
    cambiosSinGuardar.value = modifiedCategories.value.size
  }

  function addCategory(category: Category) {
    if (!categories.value.some(c => c.name === category.name)) {
      if (DEBUG) console.log('Adding new category:', category.name)
      categories.value.push(category)
      markCategoryAsModified(category.name)
    }
  }

  function addSentence(categoryName: string, pilarName: string, sentence: string) {
    if (DEBUG) console.log('Adding sentence to:', categoryName, pilarName)
    const category = categories.value.find(c => c.name === categoryName)

    if (!category) {
      categories.value.push({
        name: categoryName,
        pilars: [{
          name: pilarName,
          sentences: [sentence]
        }]
      })
      markCategoryAsModified(categoryName)
      return
    }

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) {
      category.pilars.push({
        name: pilarName,
        sentences: [sentence]
      })
      markCategoryAsModified(categoryName)
      return
    }

    if (!pilar.sentences.includes(sentence)) {
      pilar.sentences.push(sentence)
      markCategoryAsModified(categoryName)
    }

    // Update experience and unlocks
    experienceManager.addExperience(50)
    experienceManager.unlockPilar(categoryName, pilarName)
    experienceManager.saveProgress()
  }

  function editSentence(categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) {
    if (DEBUG) console.log('Editing sentence in:', categoryName, pilarName)
    const category = categories.value.find(c => c.name === categoryName)
    if (!category) return

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) return

    if (sentenceIndex >= 0 && sentenceIndex < pilar.sentences.length) {
      pilar.sentences[sentenceIndex] = sentence
      markCategoryAsModified(categoryName)
    }
  }

  function deleteSentence(categoryName: string, pilarName: string, sentenceIndex: number) {
    if (DEBUG) console.log('Deleting sentence from:', categoryName, pilarName)
    const category = categories.value.find(c => c.name === categoryName)
    if (!category) return

    const pilar = category.pilars.find(p => p.name === pilarName)
    if (!pilar) return

    if (sentenceIndex >= 0 && sentenceIndex < pilar.sentences.length) {
      pilar.sentences.splice(sentenceIndex, 1)
      markCategoryAsModified(categoryName)
    }
  }

  async function guardarCambiosFirebase() {
    const userId = auth.currentUser?.uid
    if (!userId) {
      throw new Error('Usuario no autenticado')
    }

    if (isContadorCero.value) {
      if (DEBUG) console.log('No hay cambios que guardar')
      return
    }

    try {
      if (DEBUG) {
        console.log('Saving changes to Firebase')
        console.log('Modified categories:', Array.from(modifiedCategories.value))
        console.log('Categories to save:', categories.value.filter(c =>
          modifiedCategories.value.has(c.name)
        ))
      }

      // Only save modified categories
      const categoriesToSave = categories.value.filter(cat =>
        modifiedCategories.value.has(cat.name)
      )

      await viajeRepository.saveCategories(userId, categoriesToSave)
      modifiedCategories.value.clear()
      cambiosSinGuardar.value = 0

      if (DEBUG) console.log('Changes saved successfully')
    } catch (error) {
      console.error('Error guardando cambios:', error)
      throw error
    }
  }

  async function cargaInicialColeccionFirebase() {
    await experienceManager.saveProgress()

    if (!datosCargados.value) {
      const userId = auth.currentUser?.uid
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }

      const loadedCategories = await viajeRepository.loadCategories(userId)
      if (loadedCategories) {
        categories.value = loadedCategories
      }
      datosCargados.value = true
      modifiedCategories.value.clear()
      cambiosSinGuardar.value = 0
      if (DEBUG) console.log('Initial data loaded:', categories.value)
    }
  }

  return {
    // State
    categories,
    cambiosSinGuardar,
    datosCargados,
    categoriaSeleccionada,
    pilarSeleccionado,
    pilars,

    // Getters
    isContadorCero,
    hasPendingChanges,

    // Actions
    setCategoriaSeleccionada,
    setPilarSeleccionado,
    addCategory,
    addSentence,
    editSentence,
    deleteSentence,
    guardarCambiosFirebase,
    cargaInicialColeccionFirebase
  }
})
