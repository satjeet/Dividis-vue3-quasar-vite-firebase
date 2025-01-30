import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore'

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
    pilarSeleccionado: '' as string
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
        await setDoc(doc(db, 'usuarios', usuarioId), {
          categories: this.categories
        })
      }
      this.cambiosSinGuardar = 0
    },
    async cargaInicialColeccionFirebase () {
      if (!this.datosCargados) {
        const usuarioId = auth.currentUser?.uid
        if (usuarioId) {
          const categoriesRef = doc(db, 'usuarios', usuarioId)
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
            this.datosCargados = true
          } else {
            console.log('No such document!')
          }
        }
      }
    }
  }
})
