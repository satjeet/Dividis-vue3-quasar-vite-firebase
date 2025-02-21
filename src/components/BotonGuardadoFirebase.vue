<template>
  <q-btn :loading="isSaving" :disabled="shouldDisableButton" @click="guardarCambios" color="primary" class="save-button"
    push>
    <template v-slot:default>
      <span class="text-white">{{ buttonLabel }}</span>
      <q-badge v-if="!isContadorCero" color="orange" floating>
        {{ cambiosSinGuardar }}
      </q-badge>
    </template>

    <template v-slot:loading>
      <q-spinner-dots color="white" />
      <span class="q-ml-sm">{{ loadingMessage }}</span>
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { storeToRefs } from 'pinia'
import { useNotifications } from '../composables'

interface SaveButtonEmits {
  (e: 'successful-save'): void
}

const emit = defineEmits<SaveButtonEmits>()
const notify = useNotifications()
const store = useViajeStore()

// Use storeToRefs for reactive store properties
const {
  cambiosSinGuardar,
  isContadorCero
} = storeToRefs(store)

// Component state
const isSaving = ref(false)
const loadingMessage = ref('Guardando cambios...')

// Computed properties
const shouldDisableButton = computed(() => isContadorCero.value || isSaving.value)

const buttonLabel = computed(() => {
  if (isContadorCero.value) {
    return 'Guardado ✓'
  }
  return `Grabar ${cambiosSinGuardar.value} cambio${cambiosSinGuardar.value > 1 ? 's' : ''}`
})

// Methods
async function guardarCambios(): Promise<void> {
  if (isContadorCero.value || isSaving.value) return

  isSaving.value = true
  loadingMessage.value = 'Guardando cambios...'

  try {
    await store.guardarCambiosFirebase()
    notify.success('Cambios guardados exitosamente')
    emit('successful-save')

  } catch (error) {
    console.error('Error al guardar cambios:', error)
    notify.error(
      error instanceof Error ? error.message : 'Error desconocido al guardar cambios'
    )
  } finally {
    isSaving.value = false
    loadingMessage.value = 'Guardando cambios...'
  }
}

// Expose methods for parent components
defineExpose({
  guardarCambios
})
</script>

<style scoped>
.save-button {
  min-width: 150px;
  transition: all 0.3s ease;
}

.save-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.save-button .q-badge {
  font-size: 0.8em;
  padding: 4px 6px;
  transform: scale(0.85) translate(25%, -25%);
}

.save-button:disabled {
  opacity: 0.7;
}

.save-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

.q-spinner-dots {
  font-size: 1.2em;
}
</style>
