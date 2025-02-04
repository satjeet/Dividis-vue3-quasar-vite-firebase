<template>
  <div>
    <q-btn flat round dense icon="palette" label="Estilos" color="white" @click="toggleMenu" />
    <q-menu v-if="menu" anchor="top right" self="top right">
      <q-list>
        <q-item clickable v-for="(theme, index) in themes" :key="index" @click="applyTheme(theme)">
          <q-item-section>{{ theme.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ThemesWeb',
  setup () {
    const $q = useQuasar()
    const menu = ref(false)
    const selectedTheme = ref(null)
    const themes = [
      { name: 'Estilo Naranja', key: 'orange' },
      { name: 'Estilo Azul', key: 'blue' },
      { name: 'Estilo Verde', key: 'green' },
      { name: 'Estilo Púrpura', key: 'purple' },
      { name: 'Estilo Rojo', key: 'red' },
      { name: 'Estilo Oscuro', key: 'dark' },
     // { name: 'Estilo Iridiscente', key: 'iridescent' },
      { name: 'Estilo Gold', key: 'gold' },
      //{ name: 'Estilo Diamante', key: 'diamond' },
      //{ name: 'Estilo Astronauta', key: 'astronaut' }
    ]

    function toggleMenu() {
      menu.value = !menu.value;
    }

    function applyTheme(theme) {
      selectedTheme.value = theme
      menu.value = false
    }

    watch(selectedTheme, (newTheme) => {
      if (newTheme) {
        document.body.setAttribute('data-theme', newTheme.key);
        $q.dark.set(false); // Desactivar el modo oscuro si es necesario
      }
    })

    return {
      menu,
      themes,
      toggleMenu,
      applyTheme
    }
  }
})
</script>

<style scoped>
.q-btn {
  margin-right: 10px;
}

.q-menu {
  z-index: 1000; /* Asegura que el menú está por encima de otros elementos */
}
</style>































