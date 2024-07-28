<template>
  <q-layout view="lHh lpr lFf" container :style="`height: ${userGoogle ? '150px' : '98px'}`" class="shadow-2 align-center bg-primary rounded-borders">
    <q-header reveal elevated class="bg-primary text-white" :height-hint="userGoogle ? '150' : '98'">
      <q-toolbar>
        <q-toolbar-title>
          Diseña una vida que Disfrutes
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar inset v-if="userGoogle">
            <q-toolbar-title>

            <div class="text-weight-bold">{{ userGoogle.displayName }}</div>
            <div class="text-weight-bold"> Nivel :1</div>
            <q-linear-progress stripe rounded size="25px" :value="progress2" color="warning" class="q-mt-sm" >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="accent" :label="progressLabel2" />
                </div>
       </q-linear-progress>
            <div class="text-weight-bold">Experiencia :</div>
            <q-linear-progress stripe rounded size="20px" :value="progress2" color="warning" class="q-mt-sm" />
            </q-toolbar-title>
      </q-toolbar>

    </q-header>
  </q-layout>
</template>

<script setup lang="ts">
import { inject } from 'vue'

// usar google como proveedor de autenticación

const userGoogle = inject('userGoogle')
const progress2 = 0.6
const progressLabel2 = '52.5%' + ' de experiencia'
</script>
