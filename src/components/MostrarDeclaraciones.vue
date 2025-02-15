<template>
  <div class="declaraciones-container" @scroll="handleScroll">
    <ul>
      <li v-for="(declaracion, index) in paginatedDeclaraciones" :key="declaracion.id"
        class="declaracion-item bg-primary">
        <div class="declaracion-header">
          <span class="declaracion-categoria">{{ declaracion.categoria }}</span>
          <span class="declaracion-pilar">{{ declaracion.pilar }}</span>
        </div>
        <p class="declaracion-texto">{{ declaracion.texto }}</p>
        <div class="declaracion-interacciones">
          <q-btn flat round dense @click="react(declaracion, 'meEncanta')" icon="favorite"
            :color="declaracion.usuariosReaccionTipo?.[usuarioId] === 'meEncanta' ? 'red' : 'grey'">
            <q-badge color="red">{{ declaracion.reacciones?.meEncanta || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="react(declaracion, 'estaOk')" icon="thumb_up"
            :color="declaracion.usuariosReaccionTipo?.[usuarioId] === 'estaOk' ? 'blue' : 'grey'">
            <q-badge color="blue">{{ declaracion.reacciones?.estaOk || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="react(declaracion, 'mejorCambiala')" icon="thumb_down"
            :color="declaracion.usuariosReaccionTipo?.[usuarioId] === 'mejorCambiala' ? 'orange' : 'grey'">
            <q-badge color="orange">{{ declaracion.reacciones?.mejorCambiala || 0 }}</q-badge>
          </q-btn>
          <q-btn flat round dense @click="compartirDeclaracion(declaracion)" icon="share"
            :color="declaracion.usuariosCompartieron?.includes(usuarioId) ? 'green' : 'grey'"
            :disable="declaracion.creadorId === usuarioId">
            <q-badge :color="declaracion.usuariosCompartieron?.includes(usuarioId) ? 'green' : 'grey'">
              {{ declaracion.compartidos || 0 }}
            </q-badge>
            <q-tooltip>
              <span v-if="declaracion.creadorId === usuarioId">No puedes compartir tu propia declaración</span>
              <span v-else-if="declaracion.usuariosCompartieron?.includes(usuarioId)">Ya has compartido esta
                declaración</span>
              <span v-else>Compartir declaración</span>
            </q-tooltip>
          </q-btn>
        </div>
      </li>
    </ul>
    <q-btn label="Cargar Más" @click="cargarMasDeclaraciones" />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useDeclaracionesReactions } from '../composables/useDeclaracionesReactions';
import { useDeclaracionesPagination } from '../composables/useDeclaracionesPagination';
import type { Declaracion } from '../types/declaracion';

// Get user ID from injected Google user
const userGoogle = inject('userGoogle') as any;
const usuarioId = userGoogle?.value?.uid;

// Initialize pagination and reaction handlers
const {
  paginatedDeclaraciones,
  cargarMasDeclaraciones,
  inicializarDeclaraciones,
  handleScroll
} = useDeclaracionesPagination();

const { react, compartirDeclaracion } = useDeclaracionesReactions(usuarioId);

// Component lifecycle
onMounted(async () => {
  await inicializarDeclaraciones();
});
</script>

<style lang="scss">
@import '../assets/styles/MostrarDeclaraciones.scss';
</style>
