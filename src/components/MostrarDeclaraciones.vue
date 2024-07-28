<template>
  <div>
    <h2>Declaraciones</h2>
    <ul>
      <li v-for="(declaracion, index) in declaraciones" :key="index">
        {{ declaracion.texto }} - {{ declaracion.pilar }} - {{ declaracion.categoria }}
      </li>
    </ul>
    <button @click="guardarEnAmbasStores">Guardar en Ambas Stores</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDeclaracionesStore } from '../stores/declaraciones-store'
import { useViajeStore } from '../stores/viaje-store'

export default defineComponent({
  name: 'MostrarDeclaraciones',
  setup () {
    const declaracionesStore = useDeclaracionesStore()
    const viajeStore = useViajeStore()

    const guardarEnAmbasStores = async () => {
      for (const declaracion of declaracionesStore.declaraciones) {
        viajeStore.addSentence(declaracion.categoria, declaracion.pilar, declaracion.texto)
      }
      await viajeStore.guardarCambiosFirebase()
      await declaracionesStore.guardarCambiosFirebase()
    }

    return {
      declaraciones: declaracionesStore.declaraciones,
      guardarEnAmbasStores
    }
  }
})
</script>
