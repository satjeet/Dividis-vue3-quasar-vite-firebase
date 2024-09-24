<template>
  <div class="col-2">
    <div v-if="category && pilar" class="text-h5 q-mb-md">
      {{ category }} > {{ pilar }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CategoryPilarHeader',
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
