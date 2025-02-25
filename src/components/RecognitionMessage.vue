<template>
  <q-dialog v-model="showMessage" transition-show="slide-down" transition-hide="slide-up">
    <q-card class="bg-secondary text-white">
      <q-card-section>
        <p>{{ message }}</p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { recognitionMessages } from '../constants/recognitionMessages'
import type { MessageCategory, PilarType } from '../types/recognition'

export default defineComponent({
  name: 'RecognitionMessage',
  setup() {
    const store = useViajeStore()
    const showMessage = ref(false)

    const lastCategory = computed(() => store.categoriaSeleccionada)
    const lastPilar = computed(() => store.pilarSeleccionado as PilarType)

    const message = computed(() => {
      if (lastCategory.value && lastPilar.value) {
        const areaMessages = recognitionMessages[lastCategory.value]
        if (areaMessages) {
          const pilarMessages = areaMessages[lastPilar.value]
          if (pilarMessages) {
            const randomIndex = Math.floor(Math.random() * pilarMessages.length)
            return pilarMessages[randomIndex]
          }
        }
      }
      return null
    })

    onMounted(() => {
      if (message.value) {
        showMessage.value = true
        setTimeout(() => {
          showMessage.value = false
        }, 2500)
      }
    })

    return {
      showMessage,
      message
    }
  }
})
</script>

<style scoped>
.q-card {
  max-width: 400px;
  margin: auto;
}
</style>
