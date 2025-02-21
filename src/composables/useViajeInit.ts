import { ref, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { useUserStore } from '../stores/user-store'
import { CategoryService } from '../services/CategoryService'

export function useViajeInit() {
  const viajeStore = useViajeStore()
  const userStore = useUserStore()
  const categoryService = new CategoryService()

  const isLoading = ref(false)
  const loadingMessage = ref('')
  const error = ref<string | null>(null)

  const isInitialized = computed(() =>
    viajeStore.datosCargados && userStore.datosCargados && !isLoading.value
  )

  async function initializeViaje() {
    isLoading.value = true
    error.value = null

    try {
      // Load user data first
      loadingMessage.value = 'Cargando datos del usuario...'
      await userStore.loadUserData()

      // Then load categories
      loadingMessage.value = 'Cargando categorías...'
      await categoryService.loadCategories()

      // Initialize default categories if needed
      if (viajeStore.categories.length === 0) {
        loadingMessage.value = 'Inicializando categorías por defecto...'
        categoryService.initializeDefaultCategories()
        await categoryService.saveChanges()
      }

      isLoading.value = false
      loadingMessage.value = ''
    } catch (err) {
      console.error('Error initializing viaje:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      isLoading.value = false
    }
  }

  async function retryInitialization() {
    await initializeViaje()
  }

  return {
    isLoading,
    loadingMessage,
    error,
    isInitialized,
    initializeViaje,
    retryInitialization
  }
}
