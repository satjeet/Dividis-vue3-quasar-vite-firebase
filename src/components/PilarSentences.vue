<template>
  <div class="pilar-sentences-container">
    <ul>
      <li v-for="(sentence, index) in sentencesWithPublicStatus" :key="index" class="q-py-sm">
        <div class="row" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="col text-left">{{ sentence.text }}</div>
          <div class="col-auto">
            <q-btn flat round dense :icon="sentence.isPublic ? 'lock_open' : 'lock'"
              :color="sentence.isPublic ? 'positive' : 'grey'" @click="togglePublic(index)" class="q-mr-sm" />
            <q-btn flat round dense icon="edit" @click="editSentence(index)" />
            <q-btn flat round dense icon="delete" @click="deleteSentence(index)" />
          </div>
        </div>
      </li>
    </ul>
    <div v-if="editingIndex !== null">
      <label>
        Edita la sentencia:
        <input type="text" v-model="editingSentence" />
      </label>
      <q-btn label="Save" @click="saveEdit" />
      <q-btn label="Cancel" @click="cancelEdit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { useDeclaracionesStore } from '../stores/declaraciones-store'
import { auth } from '../firebase'

export default defineComponent({
  props: {
    category: { type: String, required: true },
    pilar: { type: String, required: true }
  },
  setup(props) {
    const viajeStore = useViajeStore()
    const declaracionesStore = useDeclaracionesStore()
    const editingIndex = ref<number | null>(null)
    const editingSentence = ref('')

    onMounted(async () => {
      await declaracionesStore.cargarDeclaraciones()
    })

    const sentencesWithPublicStatus = computed(() => {
      const category = viajeStore.categories.find(cat => cat.name === props.category)
      if (category) {
        const pilar = category.pilars.find(pilar => pilar.name === props.pilar)
        if (pilar) {
          return pilar.sentences.map(text => {
            const currentUser = auth.currentUser
            const matchingDeclaracion = declaracionesStore.declaraciones.find(d =>
              d.texto === text &&
              d.categoria === props.category &&
              d.pilar === props.pilar
            )

            // Solo mostrar como pública si el usuario actual es el creador
            const isPublic = matchingDeclaracion &&
              currentUser &&
              matchingDeclaracion.creadorId === currentUser.uid

            return {
              text,
              isPublic: !!isPublic
            }
          })
        }
      }
      return []
    })

    async function togglePublic(index: number) {
      const sentence = sentencesWithPublicStatus.value[index]
      const currentUser = auth.currentUser

      if (!currentUser) return

      if (!sentence.isPublic) {
        // Hacer pública la declaración
        const newDeclaracion = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          texto: sentence.text,
          pilar: props.pilar,
          categoria: props.category,
          creadorId: currentUser.uid,
          compartidos: 0,
          reacciones: {
            meEncanta: 0,
            estaOk: 0,
            mejorCambiala: 0
          },
          usuariosReaccionaron: [],
          usuariosCompartieron: [],
          usuariosReaccionTipo: {},
          esPublica: true
        }

        try {
          await declaracionesStore.agregarDeclaracion(newDeclaracion)
        } catch (error) {
          console.error('Error al hacer pública la declaración:', error)
        }
      } else {
        // Hacer privada la declaración
        const declaracion = declaracionesStore.declaraciones.find(d =>
          d.texto === sentence.text &&
          d.categoria === props.category &&
          d.pilar === props.pilar &&
          d.creadorId === currentUser.uid // Solo si es el creador
        )

        if (declaracion) {
          try {
            // Si tiene usuarios que la compartieron
            if (declaracion.usuariosCompartieron.length > 0) {
              // Transferir la propiedad al primero que la compartió
              const nuevoPropietario = declaracion.usuariosCompartieron[0]
              await declaracionesStore.transferirPropiedad(declaracion.id, nuevoPropietario)
            } else {
              // Si nadie la ha compartido, eliminarla
              await declaracionesStore.eliminarDeclaracion(declaracion.id)
            }
          } catch (error) {
            console.error('Error al hacer privada la declaración:', error)
          }
        }
      }
    }

    function editSentence(index: number) {
      editingIndex.value = index
      editingSentence.value = sentencesWithPublicStatus.value[index].text
    }

    function saveEdit() {
      if (editingIndex.value !== null) {
        viajeStore.editSentence(props.category, props.pilar, editingIndex.value, editingSentence.value)
        editingIndex.value = null
        editingSentence.value = ''
      }
    }

    function cancelEdit() {
      editingIndex.value = null
      editingSentence.value = ''
    }

    function deleteSentence(index: number) {
      viajeStore.deleteSentence(props.category, props.pilar, index)
    }

    return {
      sentencesWithPublicStatus,
      editingIndex,
      editingSentence,
      editSentence,
      saveEdit,
      cancelEdit,
      deleteSentence,
      togglePublic
    }
  }
})
</script>

<style scoped>
.pilar-sentences-container {
  max-height: 100%;
  overflow-y: auto;
}

.sentence-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
