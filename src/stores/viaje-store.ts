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
  actions: {
    addSentence (categoryName: string, pillarName: string, sentence: string) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences.push(sentence)
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
