<template>

  <q-layout class="fondo" view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout'

})
</script>

<style lang="scss" scoped>
@import '../css/app.scss';

.fondo{
  background-color: $matrix-fondo;
}
</style>
