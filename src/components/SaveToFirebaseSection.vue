<template>
  <div class="save-section" :class="{ 'has-changes': !isContadorCero }">
    <div class="save-container">
      <q-banner v-if="!isContadorCero" rounded dense class="bg-warning text-white q-mb-sm">
        <template v-slot:avatar>
          <q-icon name="warning" color="white" />
        </template>
        Tienes {{ cambiosSinGuardar }} cambio{{ cambiosSinGuardar > 1 ? 's' : '' }} sin guardar
      </q-banner>

      <q-banner v-if="lastSavedTime" dense rounded class="bg-secondary text-white q-mb-sm text-caption">
        <template v-slot:avatar>
          <q-icon name="update" color="white" />
        </template>
        Último guardado: {{ lastSavedTime }}
      </q-banner>

      <BotonGuardadoFirebase ref="saveButton" @successful-save="handleSaveSuccess" />

      <q-slide-transition>
        <q-banner v-if="showAutoSaveMessage" dense class="bg-positive text-white q-mt-sm text-caption" rounded>
          <template v-slot:avatar>
            <q-icon name="auto_mode" color="white" />
          </template>
          Auto-guardado activado
        </q-banner>
      </q-slide-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { storeToRefs } from 'pinia'
import { useNotifications } from '../composables'
import BotonGuardadoFirebase from './BotonGuardadoFirebase.vue'
import type { ComponentPublicInstance } from 'vue'

const store = useViajeStore()
const notify = useNotifications()

// Use storeToRefs for reactive store properties
const {
  cambiosSinGuardar,
  isContadorCero
} = storeToRefs(store)

// Component state
const autoSaveTimeout = ref<number | null>(null)
const saveButton = ref<ComponentPublicInstance<typeof BotonGuardadoFirebase> | null>(null)
const lastSavedTime = ref<string>('')
const showAutoSaveMessage = ref(false)

// Format current time
function getCurrentTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `hoy a las ${hours}:${minutes}`
}

function handleSaveSuccess() {
  lastSavedTime.value = getCurrentTime()
  notify.success('Cambios guardados exitosamente')
}

// Auto-save functionality
watch(() => cambiosSinGuardar.value, (newValue) => {
  if (newValue > 0) {
    // Clear any existing timeout
    if (autoSaveTimeout.value !== null) {
      window.clearTimeout(autoSaveTimeout.value)
    }

    // Set new timeout for auto-save
    autoSaveTimeout.value = window.setTimeout(async () => {
      if (!isContadorCero.value && saveButton.value) {
        showAutoSaveMessage.value = true
        await saveButton.value.guardarCambios()
        setTimeout(() => {
          showAutoSaveMessage.value = false
        }, 3000)
      }
    }, 30000) // Auto-save after 30 seconds of no changes
  }
})

// Clear timeout when component is destroyed
onUnmounted(() => {
  if (autoSaveTimeout.value !== null) {
    window.clearTimeout(autoSaveTimeout.value)
  }
})
</script>

<style scoped>
.save-section {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2000;
  transition: all 0.3s ease;
}

.save-section.has-changes {
  animation: attention 2s infinite;
}

.save-container {
  background: rgba(33, 33, 33, 0.95);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  max-width: 300px;
  transition: all 0.3s ease;
}

.save-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

@keyframes attention {

  0%,
  100% {
    transform: translateY(0);
  }

  5%,
  15% {
    transform: translateY(-4px);
  }

  10%,
  20% {
    transform: translateY(0);
  }
}

.q-banner {
  min-height: unset;
  padding: 4px 8px;
  border-radius: 8px;
}

.text-caption {
  font-size: 0.7rem;
  opacity: 0.9;
}

/* Transitions */
.q-slide-transition-enter-active,
.q-slide-transition-leave-active {
  transition: all 0.3s ease;
}

.q-slide-transition-enter-from,
.q-slide-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.save-section:not(.has-changes) {
  opacity: 0.85;
}

.save-section:not(.has-changes):hover {
  opacity: 1;
}
</style>
