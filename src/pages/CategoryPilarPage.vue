<template>
  <q-layout view="lHh Lpr lFf">
 <NavBar> </NavBar>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
  <h1>{{ $route.params.category }}</h1>
    <h2>{{ $route.params.pillar }}</h2>
    <add-sentence :category="category" :pillar="pillar" />
    <pillar-sentences :category="category" :pillar="pillar" />

  </div>
    <FooterBar> </FooterBar>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddSentence from '../components/AddSentence.vue'
import PillarSentences from '../components/PillarSentences.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from 'components/NavBar.vue'

export default defineComponent({
  name: 'CategoryPillarPage',
  components: {
    AddSentence,
    PillarSentences,
    FooterBar,
    NavBar
  },
  props: {
    category: {
      type: String,
      required: true
    },
    pillar: {
      type: String,
      required: true
    }
  }
})
</script>
