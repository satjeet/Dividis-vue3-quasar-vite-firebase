<template>
  <div class="row justify-between q-pa-md">
    <q-btn
      flat
      round
      dense
      icon="arrow_back"
      @click="prevPilar"
      :disable="!hasPrevPilar"
      :label="prevPilarName"
      :tooltip="prevPilarName"
      color="white"
    />
    <q-btn
      flat
      round
      dense
      icon="arrow_forward"
      @click="nextPilar"
      :disable="!hasNextPilar"
      :label="nextPilarName"
      :tooltip="nextPilarName"
      color="white"
    />
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
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>









