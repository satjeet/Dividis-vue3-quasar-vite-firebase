<template>
  <div class="declaraciones-container">
    <h2>Declaraciones</h2>
    <ul>
      <li v-for="(declaracion, index) in declaraciones" :key="index" class="declaracion-item">
        <p><strong>Texto:</strong> {{ declaracion.texto }}</p>
        <p><strong>Categoría:</strong> {{ declaracion.categoria }}</p>
        <p><strong>Pilar:</strong> {{ declaracion.pilar }}</p>
        <div>
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
import { defineComponent, ref, inject, onMounted, watch } from 'vue';
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

    const cargarMasDeclaraciones = async () => {
      await declaracionesStore.cargarMasDeclaraciones();
    };

    onMounted(async () => {
      await declaracionesStore.cargarDeclaraciones();
    });

    watch(declaracionesStore.declaraciones, (newVal) => {
      console.log('Declaraciones actualizadas:', newVal);
    });

    return {
      declaraciones: declaracionesStore.declaraciones,
      react,
      compartirDeclaracion,
      cargarMasDeclaraciones
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
}

.declaracion-item {
  list-style: none;
  margin: 10px 0;
  text-align: center;
}
</style>
