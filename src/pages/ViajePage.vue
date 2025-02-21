<template>
  <div v-if="error" class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div class="column items-center">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-h6 q-mt-md">{{ error }}</div>
      <q-btn class="q-mt-md" color="white" text-color="blue" @click="retryInitialization">
        Reintentar
      </q-btn>
    </div>
  </div>

  <div v-else-if="isLoading || !isInitialized"
    class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div class="column items-center">
      <q-spinner-dots size="50px" color="white" />
      <div class="text-h6 q-mt-md">Cargando datos...</div>
      <div class="text-subtitle1 q-mt-sm">{{ loadingMessage }}</div>
    </div>
  </div>

  <div v-else class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <RecognitionMessage />
      <div class="q-pa-md">
        <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated
          control-color="white" navigation padding arrows infinite height="600px"
          class="bg-primary text-white shadow-1 rounded-borders">
          <template v-slot:navigation-icon="{ active, btnProps, onClick }">
            <q-btn v-if="active" size="lg" icon="where_to_vote" color="yellow" flat round dense @click="onClick" />
            <q-btn v-else size="sm" :icon="btnProps.icon" color="white" flat round dense @click="onClick" />
          </template>

          <CarouselCard name="style" title="Salud" icon="favorite" />
          <CarouselCard name="tv" title="Personalidad" icon="add_reaction" />
          <CarouselCard name="layers" title="Intelecto" icon="psychology" />
          <CarouselCard name="map" title="Carrera" icon="insights" />
          <CarouselCard name="money" title="Finanzas" icon="attach_money" />
          <CarouselCard name="calidad" title="Calidad De Vida" icon="flare" />
          <CarouselCard name="emocion" title="Emocionalidad" icon="color_lens" />
          <CarouselCard name="relaciones" title="Relaciones" icon="diversity_1" />
        </q-carousel>
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated to="/" label="Go Home" no-caps />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CarouselCard from 'components/CarouselCard.vue'
import RecognitionMessage from 'components/RecognitionMessage.vue'
import { useViajeInit } from '../composables/useViajeInit'

// Initialize components and states
const slide = ref('style')
const {
  isLoading,
  loadingMessage,
  error,
  isInitialized,
  initializeViaje,
  retryInitialization
} = useViajeInit()

// Initialize data on mount
onMounted(async () => {
  await initializeViaje()
})
</script>

<style lang="scss" scoped>
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
