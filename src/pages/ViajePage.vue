
<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">

    <div>
      <div class="q-pa-md">
        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable
          animated
          control-color="white"
          navigation
          padding
          arrows
          infinite
          height="600px"
          class="bg-primary text-white shadow-1 rounded-borders"
        >
          <template v-slot:navigation-icon="{ active, btnProps, onClick }">
            <q-btn v-if="active" size="lg" icon="where_to_vote" color="yellow" flat round dense @click="onClick" />
            <q-btn v-else size="sm" :icon="btnProps.icon" color="white" flat round dense @click="onClick" />
          </template>

          <CarouselCard name="style" title="Salud" icon="favorite" />
          <CarouselCard name="tv" title="Intelecto" icon="psychology" />
          <CarouselCard name="layers" title="Personalidad" icon="add_reaction" />
          <CarouselCard name="map" title="Finanzas" icon="attach_money" />
          <CarouselCard name="Carrera" title="Carrera" icon="insights" />
          <CarouselCard name="emocion" title="Emocionalidad" icon="color_lens" />
          <CarouselCard name="calidad" title="Calidad de Vida" icon="flare" />
          <CarouselCard name="relaciones" title="Relaciones" icon="diversity_1" />
          <CarouselCard name="vision" title="Vision" icon="brightness_low" />

        </q-carousel>
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
    <FooterBar> </FooterBar>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FooterBar from 'components/FooterBar.vue'
import CarouselCard from 'components/CarouselCard.vue'

export default defineComponent({
  name: 'ViajePage',
  setup () {
    return {
      slide: ref('style'),
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'

    }
  },
  components: { FooterBar, CarouselCard }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
