<template>
  <div class="navigation-container">
    <q-btn flat round dense @click="prevPilar" :disable="!hasPrevPilar || isPilarLocked(prevPilarName)" class="left-btn"
      color="white">
      <template v-if="isPilarLocked(prevPilarName)">
        <q-icon name="lock" />
      </template>
      <span>{{ prevPilarName }}</span>
      <q-icon name="arrow_back" />
    </q-btn>
    <q-btn flat round dense @click="nextPilar" :disable="!hasNextPilar || isPilarLocked(nextPilarName)"
      class="right-btn" color="white">
      <q-icon name="arrow_forward" />
      <span>{{ nextPilarName }}</span>
      <template v-if="isPilarLocked(nextPilarName)">
        <q-icon name="lock" />
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useViajeStore } from '../stores/viaje-store';
import { useUserStore } from '../stores/user-store';

const props = defineProps<{
  category: string;
  pilar: string;
}>();

const emit = defineEmits(['update:pilar']);

const viajeStore = useViajeStore();
const userStore = useUserStore();
const pilars = viajeStore.pilars;

const pilarIndex = computed(() => pilars.findIndex(pilar => pilar === props.pilar));

const hasPrevPilar = computed(() => pilarIndex.value >= 0);
const hasNextPilar = computed(() => pilarIndex.value >= 0);

const prevPilarName = computed(() => {
  if (pilarIndex.value > 0) {
    return pilars[pilarIndex.value - 1];
  }
  return pilars[pilars.length - 1];
});

const nextPilarName = computed(() => {
  if (pilarIndex.value < pilars.length - 1) {
    return pilars[pilarIndex.value + 1];
  }
  return pilars[0];
});

const prevPilar = () => {
  if (pilarIndex.value > 0) {
    emit('update:pilar', pilars[pilarIndex.value - 1]);
  } else {
    emit('update:pilar', pilars[pilars.length - 1]);
  }
};

const nextPilar = () => {
  if (pilarIndex.value < pilars.length - 1) {
    emit('update:pilar', pilars[pilarIndex.value + 1]);
  } else {
    emit('update:pilar', pilars[0]);
  }
};

const isPilarLocked = (pilarName: string): boolean => {
  return !userStore.isPilarUnlocked(props.category, pilarName);
};
</script>

<style scoped>
.navigation-container {
  position: relative;
  top: 0px;
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
}

.left-btn span,
.right-btn span {
  margin: 0 5px;
}
</style>
