<template>
  <div class="declaraciones-container" @scroll="handleScroll">
    <ul>
      <li v-for="(declaracion, index) in paginatedDeclaraciones" :key="index" class="declaracion-item bg-primary">
        <div class="declaracion-header">
          <span class="declaracion-categoria">{{ declaracion.categoria }}</span>
          <span class="declaracion-pilar">{{ declaracion.pilar }}</span>
        </div>
        <p class="declaracion-texto">{{ declaracion.texto }}</p>
        <div class="declaracion-interacciones">
          <q-btn flat round dense @click="react(declaracion, 'meEncanta')" icon="favorite">
            <q-badge color="red">{{ declaracion.reacciones?.meEncanta || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="react(declaracion, 'estaOk')" icon="thumb_up">
            <q-badge color="blue">{{ declaracion.reacciones?.estaOk || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="react(declaracion, 'mejorCambiala')" icon="thumb_down">
            <q-badge color="orange">{{ declaracion.reacciones?.mejorCambiala || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="compartirDeclaracion(declaracion)" icon="share">
            <q-badge color="green">{{ declaracion.compartidos || 0 }}</q-badge>
          </q-btn>
        </div>
      </li>
    </ul>
    <q-btn label="Cargar Más" @click="cargarMasDeclaraciones" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from 'vue';
import { useDeclaracionesStore, Declaracion } from '../stores/declaraciones-store';
import { useViajeStore } from '../stores/viaje-store';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default defineComponent({
  name: 'MostrarDeclaraciones',
  setup() {
    const declaracionesStore = useDeclaracionesStore();
    const viajeStore = useViajeStore();
    const userGoogle = inject('userGoogle') as any;
    const usuarioId = ref(userGoogle?.value?.uid);
    const paginatedDeclaraciones = ref<Declaracion[]>([]);
    const lastIndex = ref<number>(0);

    const react = async (declaracion: Declaracion, reaccion: keyof Declaracion['reacciones']) => {
      if (!declaracion.usuariosReaccionaron.includes(usuarioId.value)) {
        declaracion.reacciones[reaccion] = (declaracion.reacciones[reaccion] || 0) + 1;
        declaracion.usuariosReaccionaron.push(usuarioId.value);
      } else {
        declaracion.reacciones[reaccion] = (declaracion.reacciones[reaccion] || 0) - 1;
        declaracion.usuariosReaccionaron = declaracion.usuariosReaccionaron.filter((uid: string) => uid !== usuarioId.value);
      }
      await declaracionesStore.actualizarDeclaracion(declaracion);
    }

    const compartirDeclaracion = async (declaracion: Declaracion) => {
      const [categoria, pilar, id] = declaracion.id.split('-');
      const docRef = doc(db, 'declaracionesPublicas', `${categoria}-${pilar}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const declaraciones = docSnap.data().declaraciones.map((decl: Declaracion) => {
          if (decl.id === id) {
            if (!decl.usuariosCompartieron.includes(usuarioId.value)) {
              decl.compartidos += 1;
              declaracion.usuariosCompartieron.push(usuarioId.value);
              viajeStore.addSentence(decl.categoria, decl.pilar, decl.texto);
              viajeStore.guardarCambiosFirebase();
            }
          }
          return decl;
        });
        await updateDoc(docRef, { declaraciones });
      }
    }

    const cargarMasDeclaraciones = () => {
      if (declaracionesStore.declaraciones.length > lastIndex.value) {
        const nuevasDeclaraciones = declaracionesStore.declaraciones.slice(lastIndex.value, lastIndex.value + 8);
        paginatedDeclaraciones.value.push(...nuevasDeclaraciones);
        lastIndex.value += 8;
        console.log('Más declaraciones cargadas:', JSON.stringify(paginatedDeclaraciones.value, null, 2));
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        cargarMasDeclaraciones();
      }
    };

    onMounted(async () => {
      await declaracionesStore.cargarDeclaraciones();
      paginatedDeclaraciones.value = declaracionesStore.declaraciones.slice(0, 8);
      lastIndex.value = 8;
      console.log('Primeras 8 declaraciones cargadas:', JSON.stringify(paginatedDeclaraciones.value, null, 2));
    });

    return {
      paginatedDeclaraciones,
      react,
      compartirDeclaracion,
      cargarMasDeclaraciones,
      handleScroll
    };
  }
});
</script>

<style scoped>
.declaraciones-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  overflow-y: auto;
  max-height: 80vh;
  /* Ajusta esto según tus necesidades */
}

.declaracion-item {
  list-style: none;
  margin: 10px 0;
  padding: 15px;
  background-color: var(--q-color-secondary);
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.declaracion-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.declaracion-categoria,
.declaracion-pilar {
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.declaracion-texto {
  font-size: 16px;
  margin-bottom: 10px;
}

.declaracion-interacciones {
  display: flex;
  justify-content: space-around;
}

.q-btn {
  color: #fff;
}

.q-badge {
  font-size: 12px;
}
</style>
