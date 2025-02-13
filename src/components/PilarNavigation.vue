<template>
  <div class="navigation-container">
    <q-btn flat="" round="" dense="" @click="prevPilar" :disable="!hasPrevPilar || isPilarLocked(prevPilarName)"
      class="left-btn" color="white">
      <q-icon :name="isPilarLocked(prevPilarName) ? 'lock' : 'arrow_back'" />
      <span>{{ prevPilarName }}</span>
    </q-btn>
    <q-btn flat="" round="" dense="" @click="nextPilar" :disable="!hasNextPilar || isPilarLocked(nextPilarName)"
      class="right-btn" color="white">
      <span>{{ nextPilarName }}</span>
      <q-icon :name="isPilarLocked(nextPilarName) ? 'lock' : 'arrow_forward'" />
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { useUserStore } from '../stores/user-store'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pilar: { type: String, required: true }
  },
  setup(props, { emit }) {
    const viajeStore = useViajeStore()
    const userStore = useUserStore()
    const pilars = viajeStore.pilars
    const pilarIndex = computed(() => pilars.findIndex(pilar => pilar === props.pilar))

    const hasPrevPilar = computed(() => pilarIndex.value >= 0)
    const hasNextPilar = computed(() => pilarIndex.value >= 0)

    const prevPilarName = computed(() => {
      if (pilarIndex.value > 0) {
        return pilars[pilarIndex.value - 1]
      } else {
        return pilars[pilars.length - 1]
      }
    })

    const nextPilarName = computed(() => {
      if (pilarIndex.value < pilars.length - 1) {
        return pilars[pilarIndex.value + 1]
      } else {
        return pilars[0]
      }
    })

    function prevPilar() {
      if (pilarIndex.value > 0) {
        emit('update:pilar', pilars[pilarIndex.value - 1])
      } else {
        emit('update:pilar', pilars[pilars.length - 1])
      }
    }

    function nextPilar() {
      if (pilarIndex.value < pilars.length - 1) {
        emit('update:pilar', pilars[pilarIndex.value + 1])
      } else {
        emit('update:pilar', pilars[0])
      }
    }

    function isPilarLocked(pilarName: string) {
      return !userStore.isPilarUnlocked(props.category, pilarName)
    }

    return {
      hasPrevPilar,
      hasNextPilar,
      prevPilarName,
      nextPilarName,
      prevPilar,
      nextPilar,
      isPilarLocked
    }
  }
})
</script>

<style scoped="">
.navigation-container {
  position: relative;
  /* Cambiado de absolute a relative */
  top: 0px;
  /* Ajustar según sea necesario */
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.left-btn,
.right-btn {
  display: flex;
  align-items: center;
  margin: 0 10px;
  /* Añadir margen para separación */
}

.left-btn span,
.right-btn span {
  margin: 0 5px;
  /* Añadir margen para separación entre icono y texto */
}
</style>
