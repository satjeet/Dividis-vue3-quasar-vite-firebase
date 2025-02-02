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
      { name: 'Estilo 1', key: 'orange', primary: '#ff9800', secondary: '#ff5722', accent: '#82b1ff' },
      { name: 'Estilo 2', key: 'blue', primary: '#2196f3', secondary: '#03a9f4', accent: '#ff5722' },
      { name: 'Estilo 3', key: 'green', primary: '#4caf50', secondary: '#8bc34a', accent: '#9c27b0' },
      { name: 'Estilo 4', key: 'purple', primary: '#9c27b0', secondary: '#673ab7', accent: '#e91e63' },
      { name: 'Estilo 5', key: 'red', primary: '#f44336', secondary: '#e53935', accent: '#e91e63' }
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
