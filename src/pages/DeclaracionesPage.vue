<template>
  <div ref="pageContainer" @scroll="handleScroll">
    <CrearDeclaracion v-if="showCrearDeclaracion" />
    <MostrarDeclaraciones />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import CrearDeclaracion from '../components/CrearDeclaracion.vue'
import MostrarDeclaraciones from '../components/MostrarDeclaraciones.vue'

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

    const handleScroll = () => {
      if (pageContainer.value) {
        const scrollTop = pageContainer.value.scrollTop
        if (scrollTop > lastScrollTop.value) {
          // Scrolling down
          showCrearDeclaracion.value = false
        } else {
          // Scrolling up
          showCrearDeclaracion.value = true
        }
        lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop
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
      handleScroll
    }
  }
})
</script>

<style scoped>
/* Asegúrate de que el contenedor tenga un tamaño fijo y overflow para que el scroll funcione */
div[ref="pageContainer"] {
  height: 100vh;
  overflow-y: auto;
}
</style>
