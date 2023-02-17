<template>
  <div>
    <label>
      New sentence:
      <input type="text" v-model="sentence" />
    </label>
    <button @click="addSentence">Add sentence</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useViajeStore } from '../store/viajeStore'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pillar: { type: String, required: true }
  },
  setup (props) {
    const store = useViajeStore()
    const sentence = ref('')

    function addSentence () {
      store.addSentence(props.category, props.pillar, sentence.value)
      sentence.value = ''
    }

    return { sentence, addSentence }
  }
})
</script>
