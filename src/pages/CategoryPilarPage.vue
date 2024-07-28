<template>

  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">

<div class="column" style="height: 500px">
  <div class="col-2">
         <div v-if="category && pilar" class="text-h5 q-mb-md">
        {{ category }} > {{ pilar }}
      </div>
      </div>
      <div class="col-2">
        <add-sentence :category="category" :pilar="pilar" />
      </div>
      <div class="col-auto">
       <pilar-sentences :category="category" :pilar="pilar" />
      </div>
      <div class="col-2">
        <BotonGuardadoFirebase/>
      </div>
    </div>

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
