import { ref, computed } from 'vue';
import { useDeclaracionesStore, Declaracion } from '../stores/declaraciones-store';
import { useUnlockedContent } from './useUnlockedContent';

export function useDeclaracionesPagination() {
  const declaracionesStore = useDeclaracionesStore();
  const { filterUnlockedDeclaraciones } = useUnlockedContent();
  const lastIndex = ref<number>(8);
  const PAGE_SIZE = 8;

  const paginatedDeclaraciones = computed(() => {
    const unlockedDeclaraciones = filterUnlockedDeclaraciones(declaracionesStore.declaraciones);
    return unlockedDeclaraciones.slice(0, lastIndex.value);
  });

  const cargarMasDeclaraciones = () => {
    if (declaracionesStore.declaraciones.length > lastIndex.value) {
      lastIndex.value += PAGE_SIZE;
    }
  };

  const agregarNuevaDeclaracion = (declaracion: Declaracion) => {
    declaracionesStore.declaraciones.unshift(declaracion);
    if (lastIndex.value < PAGE_SIZE) {
      lastIndex.value = PAGE_SIZE;
    }
  };

  const inicializarDeclaraciones = async () => {
    await declaracionesStore.cargarDeclaraciones();
    lastIndex.value = PAGE_SIZE;
  };

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      cargarMasDeclaraciones();
    }
  };

  return {
    paginatedDeclaraciones,
    cargarMasDeclaraciones,
    agregarNuevaDeclaracion,
    inicializarDeclaraciones,
    handleScroll
  };
}
