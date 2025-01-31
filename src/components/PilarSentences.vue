<template>
  <div>
    <ul>
      <li v-for="(sentence, index) in sentences" :key="index" class="q-py-sm">
        <div class="row" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="col text-left">{{ sentence }}</div>
          <div class="col-auto">
            <q-btn flat="" round="" dense="" icon="edit" @click="editSentence(index)"></q-btn>
            <q-btn flat="" round="" dense="" icon="delete" @click="deleteSentence(index)"></q-btn>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="editingIndex !== null">
      <label>
        Edita la sentencia:
        <input type="text" v-model="editingSentence" />
      </label>
      <q-btn label="Save" @click="saveEdit"></q-btn>
      <q-btn label="Cancel" @click="cancelEdit"></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useViajeStore } from '../stores/viaje-store'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pilar: { type: String, required: true }
  },
  setup (props) {
    const store = useViajeStore()
    const sentences = computed(() => {
      const category = store.categories.find(cat => cat.name === props.category)
      if (category) {
        const pilar = category.pilars.find(pilar => pilar.name === props.pilar)
        if (pilar) {
          return pilar.sentences
        }
      }
      return []
    })
    const editingIndex = ref<number | null>(null)
    const editingSentence = ref('')

    function editSentence (index: number) {
      editingIndex.value = index
      editingSentence.value = sentences.value[index]
    }

    function saveEdit () {
      if (editingIndex.value !== null) {
        store.editSentence(props.category, props.pilar, editingIndex.value, editingSentence.value)
        editingIndex.value = null
        editingSentence.value = ''
      }
    }

    function cancelEdit () {
      editingIndex.value = null
      editingSentence.value = ''
    }

    function deleteSentence (index: number) {
      store.deleteSentence(props.category, props.pilar, index)
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


