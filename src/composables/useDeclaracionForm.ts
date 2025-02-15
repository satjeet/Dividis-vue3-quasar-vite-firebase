import { ref, computed } from 'vue';
import { useDeclaracionesStore } from '../stores/declaraciones-store';
import { useViajeStore } from '../stores/viaje-store';
import { auth } from '../firebase';
import { categorias, pilares } from '../constants/declaraciones';
import type { Declaracion } from '../types/declaracion';

export function useDeclaracionForm() {
  const declaracion = ref('');
  const categoria = ref('');
  const pilar = ref('');
  const isExpanded = ref(false);

  const storeGlobal = useDeclaracionesStore();
  const storeViaje = useViajeStore();

  const isButtonDisabled = computed(() => !categoria.value || !pilar.value || !declaracion.value.trim());

  const expand = () => {
    isExpanded.value = true;
  };

  const compress = () => {
    if (declaracion.value === '') {
      isExpanded.value = false;
    }
  };

  const createDeclaracionData = (userId: string): Declaracion => ({
    id: `${categoria.value}-${pilar.value}-${Date.now()}`,
    texto: declaracion.value,
    categoria: categoria.value,
    pilar: pilar.value,
    esPublica: true,
    creadorId: userId,
    compartidos: 0,
    reacciones: {
      meEncanta: 0,
      estaOk: 0,
      mejorCambiala: 0
    },
    usuariosReaccionaron: [],
    usuariosCompartieron: [],
    usuariosReaccionTipo: {}
  });

  const guardarDeclaracion = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('Usuario no autenticado');
      return;
    }

    const declData = createDeclaracionData(userId);

    try {
      // Guardar primero en el store global
      await storeGlobal.agregarDeclaracion(declData);

      // Luego guardar en viaje
      await storeViaje.addSentence(categoria.value, pilar.value, declaracion.value);

      // Limpiar campos
      resetForm();
    } catch (error) {
      console.error('Error al guardar la declaración:', error);
    }
  };

  const resetForm = () => {
    declaracion.value = '';
    categoria.value = '';
    pilar.value = '';
    isExpanded.value = false;
  };

  return {
    declaracion,
    categoria,
    pilar,
    isExpanded,
    isButtonDisabled,
    categorias,
    pilares,
    expand,
    compress,
    guardarDeclaracion
  };
}
