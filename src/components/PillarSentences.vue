<template>
  <div>
    <ul>
      <li v-for="(sentence, index) in sentences" :key="index">
        {{ sentence }}
        <button @click="editSentence(index)">Edit</button>
        <button @click="deleteSentence(index)">Delete</button>
      </li>
    </ul>
    <div v-if="editingIndex !== null">
      <label>
        New sentence:
        <input type="text" v-model="editingSentence" />
      </label>
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useViajeStore } from '../stores/viaje-store'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pillar: { type: String, required: true }
  },
  setup (props) {
    const store = useViajeStore()
    const sentences = ref(store.categories.find(category => category.name === props.category)?.pillars
      .find(pillar => pillar.name === props.pillar)?.sentences ?? [])
    const editingIndex = ref<number | null>(null)
    const editingSentence = ref('')

    function editSentence (index: number) {
      editingIndex.value = index
      editingSentence.value = sentences.value[index]
    }

    function saveEdit () {
      if (editingIndex.value !== null) {
        store.editSentence(props.category, props.pillar, editingIndex.value, editingSentence.value)
        editingIndex.value = null
        editingSentence.value = ''
      }
    }

    function cancelEdit () {
      editingIndex.value = null
      editingSentence.value = ''
    }

    function deleteSentence (index: number) {
      store.deleteSentence(props.category, props.pillar, index)
    }

    return {
      sentences,
      editingIndex,
      editingSentence,
      editSentence,
      saveEdit,
      cancelEdit,
      deleteSentence
    }
  }
})
</script>
