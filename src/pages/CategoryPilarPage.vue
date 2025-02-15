<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="column content-container">
      <PilarNavigation :category="props.category" :pilar="currentPilar" @update:pilar="updatePilar"
        class="pilar-navigation" />
      <div class="spacer"></div>
      <div class="header-container">
        <CategoryPilarHeader :category="props.category" :pilar="currentPilar" />
        <q-icon name="help_outline" class="q-ml-sm">
          <q-tooltip class="bg-primary">{{ pilarExplanation }}</q-tooltip>
        </q-icon>
      </div>
      <AddSentenceSection :category="props.category" :pilar="currentPilar" />
      <div class="sentences-container">
        <PilarSentencesSection :category="props.category" :pilar="currentPilar" />
      </div>
      <SaveToFirebaseSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CategoryPilarHeader from '../components/CategoryPilarHeader.vue'
import AddSentenceSection from '../components/AddSentenceSection.vue'
import PilarSentencesSection from '../components/PilarSentencesSection.vue'
import SaveToFirebaseSection from '../components/SaveToFirebaseSection.vue'
import PilarNavigation from '../components/PilarNavigation.vue'
import { PILAR_EXPLANATIONS } from '../constants/pilarExplanations'

const props = withDefaults(defineProps<{
  category: string
  pilar: string
}>(), {
  category: '',
  pilar: ''
})

const isValidPilar = (pilar: string): pilar is keyof typeof PILAR_EXPLANATIONS => {
  return pilar in PILAR_EXPLANATIONS
}

const currentPilar = ref(props.pilar)

watch(() => props.pilar, (newPilar) => {
  currentPilar.value = newPilar
})

function updatePilar(newPilar: string) {
  currentPilar.value = newPilar
}

const pilarExplanation = computed(() => {
  return isValidPilar(props.pilar) ? PILAR_EXPLANATIONS[props.pilar] : 'Explicación no disponible.'
})
</script>

<style scoped>
.content-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.pilar-navigation {
  margin-top: 20px;
}

.spacer {
  height: 10px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sentences-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
}
</style>
