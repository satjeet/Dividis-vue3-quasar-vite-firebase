<template>
  <div class="declaracion-container" ref="declaracionContainer">
    <div class="declaracion-content">
      <q-input v-model="declaracion" maxlength="250" hint="Máximo 250 caracteres" counter class="declaracion-input"
        @focus="expand" @input="expand" />
      <div v-if="isExpanded" class="selectors-row">
        <q-select v-model="categoria" :options="unlockedCategories" label="Categoría" class="declaracion-select" />
        <q-select v-model="pilar" :options="unlockedPillars" label="Pilar" class="declaracion-select" />
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
import { useUnlockedContent } from '../composables/useUnlockedContent';

const declaracionContainer = ref<HTMLElement | null>(null);
const {
  declaracion,
  categoria,
  pilar,
  isExpanded,
  isButtonDisabled,
  expand,
  compress,
  guardarDeclaracion
} = useDeclaracionForm();

const { unlockedCategories, unlockedPillars } = useUnlockedContent();

// Initialize click outside handler
useClickOutside(declaracionContainer, () => {
  if (declaracion.value === '') {
    compress();
  }
});
</script>

<style lang="scss">
@import '../assets/styles/CrearDeclaracion.scss';
</style>
