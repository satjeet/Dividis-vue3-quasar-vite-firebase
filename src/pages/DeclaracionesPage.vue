<template>
  <div>
    <CrearDeclaracion />
    <MostrarDeclaraciones />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CrearDeclaracion from '../components/CrearDeclaracion.vue'
import MostrarDeclaraciones from '../components/MostrarDeclaraciones.vue'

export default defineComponent({
  name: 'DeclaracionPage',
  components: {
    CrearDeclaracion,
    MostrarDeclaraciones
  }
})
</script>
