<template>
  <div class="col-auto">
    <pilar-sentences :category="category" :pilar="pilar" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PilarSentences from './PilarSentences.vue'

export default defineComponent({
  name: 'PilarSentencesSection',
  components: {
    PilarSentences
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
