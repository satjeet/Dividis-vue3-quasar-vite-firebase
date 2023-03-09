<template>
  <q-carousel-slide :name="name" class="column no-wrap flex-center">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <q-icon :name="icon" size="56px" />
      </q-card-section>

      <q-separator />

      <q-card-actions vertical class="my-card bg-accent text-white">
        <router-link
          v-for="(pilar, index) in pilars"
          :key="index"
          :to="{ name: 'CategoryPilarPage', params: { category: title, pilar: pilar } }"
                   @click="navigateToCategoryPilarPage(pilar)">
          <q-btn  unelevated rounded color="primary" >
            <div>{{pilar}}</div>
          </q-btn>
        </router-link>

      </q-card-actions>
    </q-card>
  </q-carousel-slide>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
    }
  }
})
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 250px
</style>
