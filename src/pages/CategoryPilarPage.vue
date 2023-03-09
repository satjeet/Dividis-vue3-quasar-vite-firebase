<template>

  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
        <BotonGuardadoFirebase/>

    <pilar-sentences :category="category" :pilar="pilar" />

    <add-sentence :category="category" :pilar="pilar" />

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddSentence from '../components/AddSentence.vue'
import PilarSentences from '../components/PilarSentences.vue'
import BotonGuardadoFirebase from '../components/BotonGuardadoFirebase.vue'

export default defineComponent({
  name: 'CategoryPilarPage',
  components: {
    AddSentence,
    PilarSentences,
    BotonGuardadoFirebase

  },
  props: {
    category: {
      type: String,
      required: true
    },
    pilar: {
      type: String,
      required: true
    }
  }
})
</script>
