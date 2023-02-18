/*
Una store de Pinia llamada viaje-store donde se almacenarán,
editaran y eliminaran las oraciones ingresadas por el usuario
en cada pilar de cada categoría
*/
import { defineStore } from 'pinia'

interface Pillar {
  name: string;
  sentences: string[];
}

interface Category {
  name: string;
  pillars: Pillar[];
}

export const useViajeStore = defineStore({
  id: 'my-viaje-store',
  state: () => ({
    categories: [] as Category[]
  }),
  actions: { /*
    addSentence (categoryName: string, pillarName: string, sentence: string) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences.push(sentence)
    }, */
    addSentence (categoryName: string, pillarName: string, sentence: string) {
      const category = this.categories.find(category => category.name === categoryName)
      if (!category) {
        // Si no se encuentra la categoría, se agrega una nueva con el pilar y la oración
        this.categories.push({
          name: categoryName,
          pillars: [{
            name: pillarName,
            sentences: [sentence]
          }]
        })
      } else {
        const pillar = category.pillars.find(pillar => pillar.name === pillarName)
        if (!pillar) {
          // Si no se encuentra el pilar, se agrega uno nuevo con la oración
          category.pillars.push({
            name: pillarName,
            sentences: [sentence]
          })
        } else {
          // Si se encuentra el pilar, se agrega la oración
          pillar.sentences.push(sentence)
        }
      }
    },
    editSentence (categoryName: string, pillarName: string, sentenceIndex: number, sentence: string) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences[sentenceIndex] = sentence
    },
    deleteSentence (categoryName: string, pillarName: string, sentenceIndex: number) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences.splice(sentenceIndex, 1)
    }
  }
})
