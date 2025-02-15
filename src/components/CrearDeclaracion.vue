<template>
  <div class="declaracion-container" ref="declaracionContainer">
    <div class="declaracion-content">
      <q-input v-model="declaracion" maxlength="250" hint="Máximo 250 caracteres" counter class="declaracion-input"
        @focus="expand" @input="expand" />
      <div v-if="isExpanded" class="selectors-row">
        <q-select v-model="categoria" :options="categorias" label="Categoría" class="declaracion-select" />
        <q-select v-model="pilar" :options="pilares" label="Pilar" class="declaracion-select" />
      </div>
      <q-btn v-if="isExpanded" label="Declarar" @click="guardarDeclaracion" class="declaracion-btn bg-primary"
        :disable="isButtonDisabled" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDeclaracionForm } from '../composables/useDeclaracionForm';
import { useClickOutside } from '../composables/useClickOutside';

const declaracionContainer = ref<HTMLElement | null>(null);
const {
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
} = useDeclaracionForm();

// Initialize click outside handler
useClickOutside(declaracionContainer, compress);
</script>

<style lang="scss">
@import '../assets/styles/CrearDeclaracion.scss';
</style>
