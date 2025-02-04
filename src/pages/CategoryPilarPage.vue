<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="column" style="height: 500px; position: relative;">
      <PilarNavigation :category="category" :pilar="pilar" @update:pilar="updatePilar" />
      <div class="spacer"></div>
      <div class="header-container">
        <CategoryPilarHeader :category="category" :pilar="pilar" />
        <q-icon name="help_outline" class="q-ml-sm">
          <q-tooltip class="bg-primary">{{ pilarExplanation }}</q-tooltip>
        </q-icon>
      </div>
      <AddSentenceSection :category="category" :pilar="pilar" />
      <PilarSentencesSection :category="category" :pilar="pilar" />
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
    const pilar = ref(props.pilar)

    watch(() => props.pilar, (newPilar) => {
      pilar.value = newPilar
    })

    function updatePilar(newPilar: string) {
      pilar.value = newPilar
    }

    const pilarExplanation = computed(() => {
      const explanations: { [key: string]: string } = {
        Vision: 'Tu Visión se refiere al estado ideal que te gustaría alcanzar en esta categoría importante. Pregúntate: ¿Cómo quieres que se sienta este área de tu vida? ¿Cómo te gustaría que luciera? ¿Qué te gustaría estar haciendo de manera consistente? Describe claramente tu Visión ideal.',
        Proposito: 'Tu Propósito se refiere a las razones convincentes detrás de lo que quieres en esta categoría. ¿Qué te energiza? ¿Qué te empodera para actuar? ¿Qué te motiva a alcanzar tu Visión? Describe POR QUÉ quieres sacar el máximo provecho de esta área de tu vida.',
        Creencias: 'Tu creencias se refiere a las creencias fundamentales que tienes sobre esta categoría. ¿En qué crees? ¿Qué creencias profundas están moldeando tu vida? ¿Tus creencias son empoderadoras? ¿Te mueven a un nivel profundo o te están frenando? ¿Cuál es tu Premisa para esta área de tu vida, o cómo te gustaría que fuera?',
        Estrategias: 'Tu Estrategia se refiere a las acciones específicas que te llevarán de donde estás ahora a donde quieres estar. ¿Cómo harás realidad tu visión? Pregúntate qué tipo de hábitos positivos, actitudes y pasos de acción puedes implementar. ¿Cuál es la RECETA para la Visión que quieres crear?',
      }
      return explanations[pilar.value as keyof typeof explanations] || 'Explicación no disponible.'
    })

    return {
      category: props.category,
      pilar,
      updatePilar,
      pilarExplanation
    }
  }
})
</script>

<style scoped="">
.spacer {
  height: 10px;
  /* Ajustar para bajar la altura del CategoryPilarHeader */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
