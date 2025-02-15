<template>
  <q-carousel-slide :name="name" class="column no-wrap flex-center">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <q-icon :name="icon" size="56px" />
      </q-card-section>

      <q-separator />

      <q-card-actions vertical class="my-card text-white">
        <div v-for="(pilar, index) in pilars" :key="index">
          <router-link v-if="isPilarUnlocked(title, pilar)"
            :to="{ name: 'CategoryPilarPage', params: { category: title, pilar: pilar } }"
            @click="navigateToCategoryPilarPage(pilar)">
            <q-btn flat rounded color="white">
              <div>{{ pilar }}</div>
            </q-btn>
          </router-link>
          <q-btn v-else flat rounded color="grey" disable>
            <q-icon name="lock" />
            <div>{{ pilar }}</div>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-carousel-slide>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user-store';
import { useViajeStore } from '../stores/viaje-store';

const props = defineProps<{
  name: string;
  title: string;
  icon: string;
}>();

const pilars = ['Vision', 'Proposito', 'Creencias', 'Estrategias'] as const;
type Pilar = typeof pilars[number];

const navigateToCategoryPilarPage = (pilar: Pilar) => {
  console.log(`Navigating to CategoryPilarPage for category ${props.title} and pilar ${pilar}`);
  const viajeStore = useViajeStore();
  viajeStore.setCategoriaSeleccionada(props.title);
  viajeStore.setPilarSeleccionado(pilar);
};

const isPilarUnlocked = (category: string, pilar: Pilar): boolean => {
  const userStore = useUserStore();
  return userStore.isPilarUnlocked(category, pilar);
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 300px;
  min-width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
