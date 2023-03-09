<template>
  <div>
    <label>
      New sentence:
      <input type="text" v-model="sentence" />
    </label>
    <button @click="addSentence">Add sentence</button>
    <button @click="guardarCambios">grabar sentence</button>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useViajeStore } from '../stores/viaje-store'

export default defineComponent({
  // Definición de las props que recibe el componente
  props: {
    category: { type: String, required: true },
    pilar: { type: String, required: true }
  },
  setup (props) {
    // Uso del store de Vuex para manejar los datos de la aplicación
    const store = useViajeStore()
    // Creación de una referencia reactiva para la oración que se va a agregar
    const sentence = ref('')

    // Función para agregar una oración al store
    function addSentence () {
      store.addSentence(props.category, props.pilar, sentence.value)
      sentence.value = ''
    }
    function guardarCambios () {
      store.guardarCambios()
    }
    // Retorno de los datos y funciones que se utilizarán en la plantilla
    return { sentence, addSentence, guardarCambios }
  }
})
</script>
