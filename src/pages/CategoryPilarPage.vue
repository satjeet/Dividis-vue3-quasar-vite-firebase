<template>

  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
















    <div class="column" style="height: 500px">
      <CategoryPilarHeader :category="category" :pilar="pilar" />
      <AddSentenceSection :category="category" :pilar="pilar" />
      <PilarSentencesSection :category="category" :pilar="pilar" />
      <SaveToFirebaseSection />
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'



import CategoryPilarHeader from '../components/CategoryPilarHeader.vue'
import AddSentenceSection from '../components/AddSentenceSection.vue'
import PilarSentencesSection from '../components/PilarSentencesSection.vue'
import SaveToFirebaseSection from '../components/SaveToFirebaseSection.vue'

export default defineComponent({
  name: 'CategoryPilarPage',
  components: {




    CategoryPilarHeader,
    AddSentenceSection,
    PilarSentencesSection,
    SaveToFirebaseSection
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
  }
})
</script>
