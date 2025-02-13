import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useUserStore } from './user-store'

interface Pilar {
  name: string;
  sentences: string[];
}

interface Category {
  name: string;
  pilars: Pilar[];
}

interface FirebaseCategoriesData {
  categories: Category[];
}

export const useViajeStore = defineStore({
  id: 'my-viaje-store',
  state: () => ({
    categories: [] as Category[],
    cambiosSinGuardar: 0 as number,
    datosCargados: false as boolean,
    categoriaSeleccionada: '' as string,
    pilarSeleccionado: '' as string,
    pilars: ['Vision', 'Proposito', 'Creencias', 'Estrategias'] as string[]
  }),
  getters: {
    SumarCambiosSinGuardar: (state) => state.cambiosSinGuardar + 1,
    isContadorCero: (state) => {
      return state.cambiosSinGuardar === 0
    }
  },
  actions: {
    setCategoriaSeleccionada (categoria: string) {
      this.categoriaSeleccionada = categoria
    },
    setPilarSeleccionado (pilar: string) {
      this.pilarSeleccionado = pilar
    },
    addSentence (categoryName: string, pilarName: string, sentence: string) {
      this.cambiosSinGuardar += 1
      const category = this.categories.find(category => category.name === categoryName)
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)

      if (!category) {
        this.categories.push({
          name: categoryName,
          pilars: [{
            name: pilarName,
            sentences: [sentence]
          }]
        })
      } else {
        const pilar = category.pilars.find(pilar => pilar.name === pilarName)
        if (!pilar) {
          this.categories[categoryIndex].pilars.push({
            name: pilarName,
            sentences: [sentence]
          })
        } else {
          if (!pilar.sentences.includes(sentence)) {
            pilar.sentences.push(sentence)
          }
        }
      }

      // Actualizar experiencia y desbloqueos
      const userStore = useUserStore()
      userStore.addExperience(50)
      if (pilarName === 'Vision') {
        userStore.unlockPilar(categoryName, 'Proposito')
      } else if (pilarName === 'Proposito') {
        userStore.unlockPilar(categoryName, 'Creencias')
      } else if (pilarName === 'Creencias') {
        userStore.unlockPilar(categoryName, 'Estrategias')
      }
      userStore.saveUserData()
    },
    editSentence (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) {
      this.cambiosSinGuardar += 1
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences[sentenceIndex] = sentence
    },
    deleteSentence (categoryName: string, pilarName: string, sentenceIndex: number) {
      this.cambiosSinGuardar += 1
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences.splice(sentenceIndex, 1)
    },
    async guardarCambiosFirebase () {
      const usuarioId = auth.currentUser?.uid
      if (usuarioId) {
        // Guardar los cambios en Firebase
        await setDoc(doc(db, 'usuarios', usuarioId, 'datos', 'categories'), {
          categories: this.categories
        }, { merge: true })
      }
      this.cambiosSinGuardar = 0
    },
    async cargaInicialColeccionFirebase () {
      const userStore = useUserStore()
      await userStore.loadUserData()

      if (!this.datosCargados) {
        const usuarioId = auth.currentUser?.uid
        if (usuarioId) {
          const categoriesRef = doc(db, 'usuarios', usuarioId, 'datos', 'categories')
          const docSnap = await getDoc(categoriesRef)
          if (docSnap.exists()) {
            const categoriesData: FirebaseCategoriesData = docSnap.data() as FirebaseCategoriesData
            const categories: Category[] = categoriesData.categories.map(categoryData => {
              return {
                name: categoryData.name,
                pilars: categoryData.pilars.map(pilarData => {
                  return {
                    name: pilarData.name,
                    sentences: pilarData.sentences
                  }
                })
              }
            })
            this.categories = categories
          } else {
            // Crear un nuevo documento con datos iniciales
            await this.guardarCambiosFirebase()
          }
          this.datosCargados = true
        }
      }
    }
  }
})



