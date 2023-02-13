
<template>
   <NavBar> </NavBar>
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

          <q-carousel-slide name="style" class="column no-wrap flex-center">

            <q-card class="my-card bg-secondary text-white">
              <q-card-section>
                <div class="text-h6">Salud</div>
                <q-icon name="favorite" size="56px" />
              </q-card-section>

              <q-separator />

              <q-card-actions vertical class="my-card bg-accent text-white">
                <q-btn flat>Vision</q-btn>
                <q-btn flat>Proposito</q-btn>
                <q-btn flat>Creencias</q-btn>
                <q-btn flat>Estrategias</q-btn>
              </q-card-actions>
            </q-card>

          </q-carousel-slide>
          <q-carousel-slide name="tv" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Intelecto</div>
                  <q-icon name="psychology" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="layers" class="column no-wrap flex-center">
             <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Personalidad</div>
                  <q-icon name="add_reaction" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="map" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Finanzas</div>
                  <q-icon name="attach_money" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="Carrera" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Carrera</div>
                  <q-icon name="insights" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="emocion" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Emocionalidad</div>
                  <q-icon name="color_lens" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="calidad" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Calidad de Vida</div>
                  <q-icon name="flare" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="relaciones" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Relaciones</div>
                  <q-icon name="diversity_1" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
          <q-carousel-slide name="vision" class="column no-wrap flex-center">
            <q-card class="my-card bg-secondary text-white">
                <q-card-section>
                  <div class="text-h6">Vision</div>
                  <q-icon name="brightness_low" size="56px" />
                </q-card-section>

                <q-separator />

                <q-card-actions vertical class="my-card bg-accent text-white">
                  <q-btn flat>Vision</q-btn>
                  <q-btn flat>Proposito</q-btn>
                  <q-btn flat>Creencias</q-btn>
                  <q-btn flat>Estrategias</q-btn>
                </q-card-actions>
              </q-card>
          </q-carousel-slide>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavBar from 'components/NavBar.vue'

export default defineComponent({
  name: 'ErrorNotFound',
  setup () {
    return {
      slide: ref('style'),
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'

    }
  },
  components: { NavBar }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
