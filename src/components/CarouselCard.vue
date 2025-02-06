<template>
  <q-carousel-slide :name="name" class="column no-wrap flex-center">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <q-icon :name="icon" size="56px" />
      </q-card-section>

      <q-separator />

      <q-card-actions vertical="" class="my-card  text-white">
        <div v-for="(pilar, index) in pilars" :key="index">
          <router-link
            v-if="isPilarUnlocked(title, pilar)"
            :to="{ name: 'CategoryPilarPage', params: { category: title, pilar: pilar } }"
            @click="navigateToCategoryPilarPage(pilar)"
          >
            <q-btn unelevated="" rounded="" color="primary">
              <q-icon name="lock_open" />
              <div>{{ pilar }}</div>
            </q-btn>
          </router-link>
          <q-btn v-else="" unelevated="" rounded="" color="grey" disabled="">
            <q-icon name="lock" />
            <div>{{ pilar }}</div>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-carousel-slide>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useUserStore } from '../stores/user-store'
  import { useViajeStore } from '../stores/viaje-store'

  export default defineComponent({
  name: 'CarouselCard',
  props: {
  name: {
  type: String,
  required: true
  },
  title: {
  type: String,
  required: true
  },
  icon: {
  type: String,
  required: true
  }
  },
  data () {
  return {
  pilars: ['Vision', 'Proposito', 'Creencias', 'Estrategias']
  }
  },
  methods: {
  navigateToCategoryPilarPage (pilar) {
  console.log(`Navigating to CategoryPilarPage for category ${this.title} and pilar ${pilar}`)
  // Obtener la instancia del store
  const viajeStore = useViajeStore()

  // Actualizar la categoría y el pilar en el store
  viajeStore.setCategoriaSeleccionada(this.title)
  viajeStore.setPilarSeleccionado(pilar)
  },
  isPilarUnlocked (category, pilar) {
  const userStore = useUserStore()
  return userStore.isPilarUnlocked(category, pilar)
  }
  }
  })
</script>

<style scoped="">
  .my-card {
  width: 100%;
  max-width: 300px;
  min-width: 300px; /* Establecer un ancho mínimo de 300px */
  height: 400px; /* Establecer una altura fija para los cuadros de las categorías */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  }
</style>
