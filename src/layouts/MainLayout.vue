<template>
  <q-layout view="lHh Lpr lFf">
   <NavBar> </NavBar>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavBar from 'components/NavBar.vue'
// import EssentialLink from 'components/EssentialLink.vue'
/*
<q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
<q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>6+22222

    EssentialLink

*/
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  }

]

export default defineComponent({
  name: 'MainLayout',

  components: { NavBar },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
