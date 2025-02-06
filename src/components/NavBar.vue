<template>
  <q-layout view="lHh lpr lFf" container="" :style="`height: ${userGoogle ? '150px' : '98px'}`" class="shadow-2 align-center bg-primary rounded-borders">
    <q-header reveal="" elevated="" class="bg-primary text-white" :height-hint="userGoogle ? '150' : '98'">
      <q-toolbar>
        <q-toolbar-title class="title">
          Diseña una vida que Disfrutes
        </q-toolbar-title>
        <q-space />
        <div class="themes-web-container">
          <ThemesWeb />
        </div>
      </q-toolbar>
      <q-toolbar inset="" v-if="userGoogle">
        <q-toolbar-title>
          <UserProgress />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>

<script setup="" lang="ts">
  import { inject } from 'vue'
  import ThemesWeb from 'components/ThemesWeb.vue'
  import UserProgress from 'components/UserProgress.vue'

  const userGoogle = inject('userGoogle')
</script>

<style scoped="">
  .title {
  flex: 1 1 auto; /* Permitir que el título use todo el ancho disponible */
  white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
  overflow: hidden; /* Ocultar cualquier desbordamiento de texto */
  text-overflow: ellipsis; /* Mostrar puntos suspensivos si el texto es demasiado largo */
  }
  .themes-web-container {
  flex: 0 0 auto; /* No permitir que el contenedor de ThemesWeb crezca o se encoja */
  display: flex;
  justify-content: flex-end;
  }
</style>





















