<template>
  <div class="sentences-list">
    <q-list v-if="sentences.length > 0">
      <q-item v-for="(sentence, index) in sentences" :key="index" class="sentence-item">
        <q-item-section>
          <q-item-label>
            <div class="sentence-content">
              <span>{{ sentence }}</span>
              <div class="sentence-actions">
                <q-btn flat round size="sm" color="primary" icon="edit" @click="editSentence(index)" />
                <q-btn flat round size="sm" color="negative" icon="delete" @click="deleteSentence(index)" />
              </div>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else class="empty-state">
      <q-icon name="note_add" size="50px" color="grey-5" />
      <div class="text-grey-6 q-mt-sm">No hay declaraciones aún</div>
    </div>

    <!-- Edit Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Declaración</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="editedSentence" autofocus @keyup.enter="saveEdit" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">¿Estás seguro de que quieres eliminar esta declaración?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotifications } from '../composables'
import { CategoryService } from '../services/CategoryService'

const categoryService = new CategoryService()

const props = defineProps<{
  category: string
  pilar: string
}>()

const sentences = ref<string[]>([])
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const editedSentence = ref('')
const editingIndex = ref(-1)
const deletingIndex = ref(-1)
const notify = useNotifications()

// Initialize and watch for changes
watch(
  () => [props.category, props.pilar],
  () => {
    loadSentences()
  },
  { immediate: true }
)

function loadSentences() {
  const pilar = categoryService.getPilarByName(props.category, props.pilar)
  if (pilar) {
    sentences.value = [...pilar.sentences]
  } else {
    sentences.value = []
  }
}

function editSentence(index: number) {
  editingIndex.value = index
  editedSentence.value = sentences.value[index]
  showEditDialog.value = true
}

async function saveEdit() {
  if (editedSentence.value.trim() && editingIndex.value !== -1) {
    try {
      categoryService.editSentence(
        props.category,
        props.pilar,
        editingIndex.value,
        editedSentence.value.trim()
      )
      notify.success('Declaración actualizada correctamente')
      loadSentences()
    } catch (error) {
      notify.error('Error al actualizar la declaración')
      console.error('Error saving edit:', error)
    }
  }
  editingIndex.value = -1
  editedSentence.value = ''
}

function deleteSentence(index: number) {
  deletingIndex.value = index
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (deletingIndex.value !== -1) {
    try {
      categoryService.deleteSentence(props.category, props.pilar, deletingIndex.value)
      notify.success('Declaración eliminada correctamente')
      loadSentences()
    } catch (error) {
      notify.error('Error al eliminar la declaración')
      console.error('Error deleting sentence:', error)
    }
  }
  deletingIndex.value = -1
}
</script>

<style scoped lang="scss">
.sentences-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

.sentence-item {
  margin-bottom: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);

    .sentence-actions {
      opacity: 1;
    }
  }
}

.sentence-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px;
  gap: 16px;

  span {
    flex: 1;
    white-space: pre-wrap;
  }
}

.sentence-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  opacity: 0.7;
}
</style>
