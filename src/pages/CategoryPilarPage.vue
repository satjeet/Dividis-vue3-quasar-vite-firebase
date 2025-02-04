<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="column" style="height: 500px; position: relative;">
      <PilarNavigation :category="category" :pilar="pilar" @update:pilar="updatePilar" />
      <div class="spacer"></div>
      <CategoryPilarHeader :category="category" :pilar="pilar" />
      <AddSentenceSection :category="category" :pilar="pilar" />
      <PilarSentencesSection :category="category" :pilar="pilar" />
      <SaveToFirebaseSection />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import CategoryPilarHeader from '../components/CategoryPilarHeader.vue'
  import AddSentenceSection from '../components/AddSentenceSection.vue'
  import PilarSentencesSection from '../components/PilarSentencesSection.vue'
  import SaveToFirebaseSection from '../components/SaveToFirebaseSection.vue'
  import PilarNavigation from '../components/PilarNavigation.vue'

  export default defineComponent({
  name: 'CategoryPilarPage',
  components: {
  CategoryPilarHeader,
  AddSentenceSection,
  PilarSentencesSection,
  SaveToFirebaseSection,
  PilarNavigation
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
  setup (props) {
  const pilar = ref(props.pilar)

  watch(() => props.pilar, (newPilar) => {
  pilar.value = newPilar
  })

  function updatePilar (newPilar: string) {
  pilar.value = newPilar
  }

  return {
  category: props.category,
  pilar,
  updatePilar
  }
  }
  })
</script>

<style scoped="">
  .spacer {
  height: 10px; /* Ajustar para bajar la altura del CategoryPilarHeader */
  }
</style>










