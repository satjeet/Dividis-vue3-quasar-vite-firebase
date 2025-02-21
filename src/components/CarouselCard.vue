<template>
  <q-carousel-slide :name="name" class="column no-wrap flex-center">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <q-icon :name="icon" size="56px" />
      </q-card-section>

      <q-separator />

      <q-card-actions vertical class="my-card text-white">
        <div v-for="(pilar, index) in availablePilars" :key="index">
          <router-link v-if="isPilarUnlocked(title, pilar)"
            :to="{ name: 'CategoryPilarPage', params: { category: title, pilar: pilar } }"
            @click="navigateToCategoryPilarPage(pilar)">
            <q-btn flat rounded color="white">
              <div>{{ pilar }}</div>
            </q-btn>
          </router-link>
          <q-btn v-else flat rounded color="grey" disable>
            <q-icon name="lock" />
            <div>{{ pilar }}</div>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-carousel-slide>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useViajeStore } from '../stores/viaje-store'
import { useUserStore } from '../stores/user-store'
import { CategoryService } from '../services/CategoryService'

const props = defineProps<{
  name: string
  title: string
  icon: string
}>()

const categoryService = new CategoryService()
const userStore = useUserStore()
const viajeStore = useViajeStore()

const availablePilars = computed(() => viajeStore.pilars)

const navigateToCategoryPilarPage = (pilar: string) => {
  console.log(`Navigating to CategoryPilarPage for category ${props.title} and pilar ${pilar}`)
  categoryService.setSelectedCategory(props.title)
  categoryService.setSelectedPilar(pilar)
}

const isPilarUnlocked = (category: string, pilar: string): boolean => {
  return userStore.isPilarUnlocked(category, pilar)
}

onMounted(async () => {
  await categoryService.loadCategories()

  // Ensure the category exists
  const category = categoryService.getCategoryByName(props.title)
  if (!category) {
    // Initialize with Vision pilar as default
    const initialPilar = {
      name: 'Vision',
      sentences: []
    }
    categoryService.addCategory(props.title, initialPilar)
    await categoryService.saveChanges()
  }
})
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 300px;
  min-width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
