<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn :disabled="isDisabled" @click="guardarCambios" push="" color="white" text-color="primary" label="Grabar Cambios en la nube">
      <q-badge v-if="cambiosSinGuardar > 0" color="orange" floating="">{{ cambiosSinGuardar }}</q-badge>
    </q-btn>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useViajeStore } from '../stores/viaje-store'
  import { storeToRefs } from 'pinia'
  import { Notify } from 'quasar'

  export default defineComponent({
  setup () {
  const store = useViajeStore()
  const { cambiosSinGuardar } = storeToRefs(store)
  const isDisabled = computed(() => store.isContadorCero)

  async function guardarCambios () {
  try {
  await store.guardarCambiosFirebase()
  Notify.create({
  type: 'positive',
  message: 'Cambios guardados exitosamente',
  timeout: 500 // Mostrar el mensaje por 1 segundo
  })
  } catch (error) {
  Notify.create({
  type: 'negative',
  message: 'Error al guardar los cambios'
  })
  }
  }

  return { guardarCambios, cambiosSinGuardar, isDisabled }
  }
  })
</script>

