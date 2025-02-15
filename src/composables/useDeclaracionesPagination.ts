import { ref } from 'vue';
import { useDeclaracionesStore, Declaracion } from '../stores/declaraciones-store';

export function useDeclaracionesPagination() {
  const declaracionesStore = useDeclaracionesStore();
  const paginatedDeclaraciones = ref<Declaracion[]>([]);
  const lastIndex = ref<number>(0);
  const PAGE_SIZE = 8;

  const cargarMasDeclaraciones = () => {
    if (declaracionesStore.declaraciones.length > lastIndex.value) {
      const nuevasDeclaraciones = declaracionesStore.declaraciones.slice(
        lastIndex.value,
        lastIndex.value + PAGE_SIZE
      );
      paginatedDeclaraciones.value.push(...nuevasDeclaraciones);
      lastIndex.value += PAGE_SIZE;
    }
  };

  const agregarNuevaDeclaracion = (declaracion: Declaracion) => {
    paginatedDeclaraciones.value.unshift(declaracion);
    if (paginatedDeclaraciones.value.length > lastIndex.value) {
      paginatedDeclaraciones.value.pop();
    }
  };

  const inicializarDeclaraciones = async () => {
    await declaracionesStore.cargarDeclaraciones();
    paginatedDeclaraciones.value = declaracionesStore.declaraciones.slice(0, PAGE_SIZE);
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
