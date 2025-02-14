<template>
  <div ref="pageContainer" @scroll="handleScroll">
    <CrearDeclaracion v-if="showCrearDeclaracion" @nuevaDeclaracion="agregarDeclaracion" />
    <MostrarDeclaraciones ref="mostrarDeclaracionesRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import CrearDeclaracion from '../components/CrearDeclaracion.vue'
import MostrarDeclaraciones from '../components/MostrarDeclaraciones.vue'
import { Declaracion } from '../stores/declaraciones-store'

export default defineComponent({
  name: 'DeclaracionPage',
  components: {
    CrearDeclaracion,
    MostrarDeclaraciones
  },
  setup() {
    const pageContainer = ref<HTMLElement | null>(null)
    const lastScrollTop = ref(0)
    const showCrearDeclaracion = ref(true)
    const mostrarDeclaracionesRef = ref<InstanceType<typeof MostrarDeclaraciones> | null>(null)

    const handleScroll = () => {
      if (pageContainer.value) {
        const scrollTop = pageContainer.value.scrollTop
        if (scrollTop > lastScrollTop.value) {
          showCrearDeclaracion.value = false
        } else {
          showCrearDeclaracion.value = true
        }
        lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop
      }
    }

    const agregarDeclaracion = (declaracion: Declaracion) => {
      if (mostrarDeclaracionesRef.value) {
        mostrarDeclaracionesRef.value.agregarNuevaDeclaracion(declaracion)
      }
    }

    onMounted(() => {
      if (pageContainer.value) {
        pageContainer.value.addEventListener('scroll', handleScroll)
      }
    })

    onBeforeUnmount(() => {
      if (pageContainer.value) {
        pageContainer.value.removeEventListener('scroll', handleScroll)
      }
    })

    return {
      pageContainer,
      showCrearDeclaracion,
      handleScroll,
      mostrarDeclaracionesRef,
      agregarDeclaracion
    }
  }
})
</script>

<style scoped>
div[ref="pageContainer"] {
  height: 100vh;
  overflow-y: auto;
}
</style>
