//Boton de guardado con contador de cambios sin guardar.
<template>
<div class="q-pa-md q-gutter-sm">
    <q-btn @click="guardarCambios" push color="white" text-color="primary" label="Grabar Cambios en la nube">
      <q-badge color="orange" floating>{{cambiosSinGuardar}}</q-badge>
    </q-btn>

  </div>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { storeToRefs } from 'pinia'
export default defineComponent({
  // Definición de las props que recibe el componente
  props: {

  },
  setup () {
    // Uso del store de Vuex para manejar los datos de la aplicación
    const store = useViajeStore()
    // Creación de una referencia reactiva para la oración que se va a agregar
    /* const cambiosSinGuardar = computed(() => {
      return store.state.cambiosSinGuardar || 0
    }) */

    const { cambiosSinGuardar } = storeToRefs(store)
    function guardarCambios () {
      store.guardarCambios()
    }
    // Retorno de los datos y funciones que se utilizarán en la plantilla
    return { guardarCambios, cambiosSinGuardar }
  }
})
</script>
