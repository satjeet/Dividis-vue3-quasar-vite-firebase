<template>
  <div class="col-2">
    <BotonGuardadoFirebase />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BotonGuardadoFirebase from './BotonGuardadoFirebase.vue'

export default defineComponent({
  name: 'SaveToFirebaseSection',
  components: {
    BotonGuardadoFirebase
  }
})
</script>
