<template>
  <div class="col-2">
    <add-sentence :category="category" :pilar="pilar" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddSentence from './AddSentence.vue'

export default defineComponent({
  name: 'AddSentenceSection',
  components: {
    AddSentence
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
