<template>
  <div v-if="datosCargados" class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <RecognitionMessage />
      <div class="q-pa-md">
        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable=""
          animated=""
          control-color="white"
          navigation=""
          padding=""
          arrows=""
          infinite=""
          height="600px"
          class="bg-primary text-white shadow-1 rounded-borders"
        >
          <template v-slot:navigation-icon="{ active, btnProps, onClick }">
            <q-btn v-if="active" size="lg" icon="where_to_vote" color="yellow" flat="" round="" dense="" @click="onClick" />
            <q-btn v-else="" size="sm" :icon="btnProps.icon" color="white" flat="" round="" dense="" @click="onClick" />
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

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated=""
        to="/"
        label="Go Home"
        no-caps=""
      />
    </div>
  </div>
  <div v-else="" class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <q-spinner-dots size="50px" color="white" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import CarouselCard from 'components/CarouselCard.vue'
  import RecognitionMessage from 'components/RecognitionMessage.vue'
  import { useViajeStore } from '../stores/viaje-store'
  import { useUserStore } from '../stores/user-store'

  export default defineComponent({
  name: 'ViajePage',
  setup () {
  const viajeStore = useViajeStore()
  const userStore = useUserStore()
  const slide = ref('style')
  const datosCargados = ref(false)

  onMounted(async () => {
  await viajeStore.cargaInicialColeccionFirebase()
  datosCargados.value = userStore.datosCargados
  })

  return {
  slide,
  datosCargados,
  lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
  }
  },
  components: { CarouselCard, RecognitionMessage }
  })
</script>

<style lang="scss" scoped="">
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

