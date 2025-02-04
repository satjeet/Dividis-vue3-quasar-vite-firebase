<template>
  <div class="main-layout-container">
    <NavBar />
    <q-layout view="lHh lpr lFf" container style="min-height: 500px" class="shadow-2 align-center bg-secondary rounded-borders main-layout">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
    <FooterBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavBar from 'components/NavBar.vue'
import FooterBar from 'components/FooterBar.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { NavBar, FooterBar },
  setup () {
    const leftDrawerOpen = ref(false)
    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style scoped>
.main-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout {
  flex: 1;
}

footer {
  margin-top: auto;
}
</style>



















