<template>
  <div ref="pageContainer" @scroll="handleScroll">
    <CrearDeclaracion v-if="showCrearDeclaracion" />
    <MostrarDeclaraciones />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CrearDeclaracion from '../components/CrearDeclaracion.vue';
import MostrarDeclaraciones from '../components/MostrarDeclaraciones.vue';

const pageContainer = ref<HTMLElement | null>(null);
const lastScrollTop = ref(0);
const showCrearDeclaracion = ref(true);

const handleScroll = () => {
  if (pageContainer.value) {
    const scrollTop = pageContainer.value.scrollTop;
    if (scrollTop > lastScrollTop.value) {
      showCrearDeclaracion.value = false;
    } else {
      showCrearDeclaracion.value = true;
    }
    lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop;
  }
};

onMounted(() => {
  if (pageContainer.value) {
    pageContainer.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (pageContainer.value) {
    pageContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
div[ref="pageContainer"] {
  height: 100vh;
  overflow-y: auto;
}
</style>
