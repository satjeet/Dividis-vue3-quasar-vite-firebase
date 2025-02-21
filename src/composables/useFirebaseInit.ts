import { useViajeStore } from '../stores/viaje-store'
import { useDeclaracionesStore } from '../stores/declaraciones-store'
import { ref } from 'vue'

export function useFirebaseInit() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const initializeData = async (): Promise<{ success: boolean; error?: string }> => {
    const viajeStore = useViajeStore()
    const declaracionesStore = useDeclaracionesStore()
    isLoading.value = true
    error.value = null

    try {
      // Load data from both stores
      await Promise.all([
        viajeStore.cargaInicialColeccionFirebase(),
        declaracionesStore.cargarDeclaraciones()
      ])

      isLoading.value = false
      return { success: true }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido'
      error.value = errorMessage
      isLoading.value = false
      return { success: false, error: errorMessage }
    }
  }

  return {
    isLoading,
    error,
    initializeData
  }
}
