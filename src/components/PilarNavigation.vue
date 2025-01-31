<template>
  <div class="navigation-container">
    <q-btn
      flat
      round
      dense
      @click="prevPilar"
      :disable="!hasPrevPilar"
      class="left-btn"
      color="white"
    >
      <q-icon name="arrow_back" />
      <span>{{ prevPilarName }}</span>
    </q-btn>
    <q-btn
      flat
      round
      dense
      @click="nextPilar"
      :disable="!hasNextPilar"
      class="right-btn"
      color="white"
    >
      <span>{{ nextPilarName }}</span>
      <q-icon name="arrow_forward" />
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pilar: { type: String, required: true }
  },
  setup (props, { emit }) {
    const store = useViajeStore()
    const pilars = store.pilars
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

    function prevPilar () {
      if (pilarIndex.value > 0) {
        emit('update:pilar', pilars[pilarIndex.value - 1])
      } else {
        emit('update:pilar', pilars[pilars.length - 1])
      }
    }

    function nextPilar () {
      if (pilarIndex.value < pilars.length - 1) {
        emit('update:pilar', pilars[pilarIndex.value + 1])
      } else {
        emit('update:pilar', pilars[0])
      }
    }

    return {
      hasPrevPilar,
      hasNextPilar,
      prevPilarName,
      nextPilarName,
      prevPilar,
      nextPilar
    }
  }
})
</script>

<style scoped>
.navigation-container {
  position: absolute;
  top: -30px; /* Ajustar para que esté 10px por encima del header */
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.left-btn {
  display: flex;
  align-items: center;
}
.right-btn {
  display: flex;
  align-items: center;
}
</style>










