<template>
  <div>
    <div class="text-weight-bold">Nivel: {{ level }}</div>
    <q-linear-progress
      stripe
      rounded
      size="25px"
      :value="progress"
      color="warning"
      class="q-mt-sm"
    >
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel" />
      </div>
    </q-linear-progress>
    <div class="text-weight-bold">Experiencia: {{ experience }} / {{ experienceToNextLevel }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useUserStore } from '../stores/user-store'

export default defineComponent({
  name: 'UserProgress',
  setup () {
    const store = useUserStore()

    const level = computed(() => store.level)
    const experience = computed(() => store.experience)
    const experienceToNextLevel = computed(() => 200) // Configuración de niveles: 200 puntos para subir de nivel

    const progress = computed(() => experience.value / experienceToNextLevel.value)
    const progressLabel = computed(() => `${(progress.value * 100).toFixed(1)}% de experiencia`)

    return {
      level,
      experience,
      experienceToNextLevel,
      progress,
      progressLabel
    }
  }
})
</script>

<style scoped>
.q-linear-progress {
  width: 100%;
}
</style>

