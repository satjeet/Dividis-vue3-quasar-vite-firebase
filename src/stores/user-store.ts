import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const level = ref(0)
  const experience = ref(0)
  const unlockedPilares = ref<string[]>(['Salud-Vision'])
  const unlockedCategorias = ref<string[]>(['Salud'])
  const datosCargados = ref(false)

  function addExperience(points: number) {
    experience.value += points
    if (experience.value >= 200) {
      experience.value -= 200
      level.value += 1
      unlockNextCategory()
    }
    saveUserData()
  }

  function unlockPilar(category: string, pilar: string) {
    const key = `${category}-${pilar}`
    if (!unlockedPilares.value.includes(key)) {
      unlockedPilares.value.push(key)
    }
    saveUserData()
  }

  function unlockNextCategory() {
    const categories = ['Salud', 'Personalidad', 'Intelecto', 'Carrera', 'Finanzas', 'CalidadDeVida', 'Emocionalidad', 'Relaciones']
    const nextCategory = categories[level.value]
    if (nextCategory && !unlockedCategorias.value.includes(nextCategory)) {
      unlockedCategorias.value.push(nextCategory)
      unlockPilar(nextCategory, 'Vision')
    }
    saveUserData()
  }

  const isPilarUnlocked = (category: string, pilar: string) => {
    return unlockedPilares.value.includes(`${category}-${pilar}`)
  }

  const isCategoriaUnlocked = (categoria: string) => {
    return unlockedCategorias.value.includes(categoria)
  }

  async function saveUserData() {
    const usuarioId = auth.currentUser?.uid
    if (usuarioId) {
      await setDoc(doc(db, 'usuarios', usuarioId, 'datos', 'progreso'), {
        level: level.value,
        experience: experience.value,
        unlockedPilares: unlockedPilares.value,
        unlockedCategorias: unlockedCategorias.value
      }, { merge: true })
    }
  }

  async function loadUserData() {
    const usuarioId = auth.currentUser?.uid
    if (usuarioId) {
      const userDoc = await getDoc(doc(db, 'usuarios', usuarioId, 'datos', 'progreso'))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        level.value = userData.level || 0
        experience.value = userData.experience || 0
        unlockedPilares.value = userData.unlockedPilares || ['Salud-Vision']
        unlockedCategorias.value = userData.unlockedCategorias || ['Salud']
      } else {
        // Crear un nuevo documento con datos iniciales
        await saveUserData()
      }
      datosCargados.value = true
    }
  }

  return {
    level,
    experience,
    unlockedPilares,
    unlockedCategorias,
    datosCargados,
    addExperience,
    unlockPilar,
    unlockNextCategory,
    isPilarUnlocked,
    isCategoriaUnlocked,
    saveUserData,
    loadUserData
  }
})


