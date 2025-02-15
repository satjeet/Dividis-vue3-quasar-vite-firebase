<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="column content-container">
      <PilarNavigation :category="category" :pilar="currentPilar" @update:pilar="updatePilar"
        class="pilar-navigation" />
      <div class="spacer"></div>
      <div class="header-container">
        <CategoryPilarHeader :category="category" :pilar="currentPilar" />
        <q-icon name="help_outline" class="q-ml-sm">
          <q-tooltip class="bg-primary">{{ pilarExplanation }}</q-tooltip>
        </q-icon>
      </div>
      <AddSentenceSection :category="category" :pilar="currentPilar" />
      <div class="sentences-container">
        <PilarSentencesSection :category="category" :pilar="currentPilar" />
      </div>
      <SaveToFirebaseSection />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import CategoryPilarHeader from '../components/CategoryPilarHeader.vue'
import AddSentenceSection from '../components/AddSentenceSection.vue'
import PilarSentencesSection from '../components/PilarSentencesSection.vue'
import SaveToFirebaseSection from '../components/SaveToFirebaseSection.vue'
import PilarNavigation from '../components/PilarNavigation.vue'
import { QIcon, QTooltip } from 'quasar'
import { PILAR_EXPLANATIONS, PilarType } from '../constants/pilarExplanations'

export default defineComponent({
  name: 'CategoryPilarPage',
  components: {
    CategoryPilarHeader,
    AddSentenceSection,
    PilarSentencesSection,
    SaveToFirebaseSection,
    PilarNavigation,
    QIcon,
    QTooltip
  },
  props: {
    category: {
      type: String,
      required: true
    },
    pilar: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const currentPilar = ref(props.pilar)

    watch(() => props.pilar, (newPilar) => {
      currentPilar.value = newPilar
    })

    function updatePilar(newPilar: string) {
      currentPilar.value = newPilar
    }

    const pilarExplanation = computed(() => {
      return PILAR_EXPLANATIONS[props.pilar as PilarType] || 'Explicación no disponible.'
    })

    return {
      currentPilar,
      updatePilar,
      pilarExplanation,
      category: props.category
    }
  }
})
</script>

<style scoped="">
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
  /* Ajustar para bajar la altura del CategoryPilarHeader */
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
