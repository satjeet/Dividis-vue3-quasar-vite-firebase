/*
Una store de Pinia llamada viaje-store donde se almacenarán,
editaran y eliminaran las oraciones ingresadas por el usuario
en cada pilar de cada categoría
*/
import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
interface Pilar {
  name: string;
  sentences: string[];
}

interface Category {
  name: string;
  pilars: Pilar[];
}

export const useViajeStore = defineStore({
  id: 'my-viaje-store',
  state: () => ({
    categories: [] as Category[],
    cambiosSinGuardar: 0 as number
  }),
  getters: {
    SumarCambiosSinGuardar: (state) => state.cambiosSinGuardar + 1,
    isContadorCero ():boolean {
      return this.cambiosSinGuardar === 0
    }

  },
  actions: { /*
    addSentence (categoryName: string, pillarName: string, sentence: string) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences.push(sentence)
    }, */
    addSentence (categoryName: string, pilarName: string, sentence: string) {
      this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      // this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar
      const category = this.categories.find(category => category.name === categoryName)
      if (!category) {
        // Si no se encuentra la categoría, se agrega una nueva con el pilar y la oración
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
          // Si no se encuentra el pilar, se agrega uno nuevo con la oración
          category.pilars.push({
            name: pilarName,
            sentences: [sentence]
          })
        } else {
          // Si se encuentra el pilar, se agrega la oración
          pilar.sentences.push(sentence)
        }
      }
    },
    editSentence (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) {
      // this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar

      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences[sentenceIndex] = sentence
    },
    deleteSentence (categoryName: string, pilarName: string, sentenceIndex: number) {
      // this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar

      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences.splice(sentenceIndex, 1)
    },
    async guardarCambiosFirebase () {
      // Obtener el identificador del usuario actual
      const usuarioId = auth.currentUser?.uid
      if (usuarioId) {
        // Guardar los cambios en Firebase
        await setDoc(doc(db, 'usuarios', usuarioId), {
          categories: this.categories
        })
      }
      this.$state.cambiosSinGuardar = 0
    }
  }
})
