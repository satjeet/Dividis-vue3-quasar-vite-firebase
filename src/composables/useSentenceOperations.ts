import { useViajeStore } from '../stores/viaje-store'
import { DeclaracionSharing } from '../services/DeclaracionSharing'
import { useDeclaracionesStore } from '../stores/declaraciones-store'
import type { Declaracion } from '../types/declaracion'
import { auth } from '../firebase'

export function useSentenceOperations() {
  const viajeStore = useViajeStore()
  const declaracionesStore = useDeclaracionesStore()
  const declaracionSharing = new DeclaracionSharing()

  const addSentence = (categoryName: string, pilarName: string, sentence: string) => {
    viajeStore.addSentence(categoryName, pilarName, sentence)
  }

  const editSentence = (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) => {
    viajeStore.editSentence(categoryName, pilarName, sentenceIndex, sentence)
  }

  const deleteSentence = (categoryName: string, pilarName: string, sentenceIndex: number) => {
    viajeStore.deleteSentence(categoryName, pilarName, sentenceIndex)
  }

  const shareSentence = async (declaracion: Declaracion) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    try {
      await declaracionSharing.shareDeclaracion(declaracion, userId)
    } catch (error) {
      console.error('Error sharing sentence:', error)
      throw error
    }
  }

  const unshareSentence = async (declaracion: Declaracion) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    try {
      await declaracionSharing.unshareDeclaracion(declaracion, userId)
    } catch (error) {
      console.error('Error unsharing sentence:', error)
      throw error
    }
  }

  const isShared = async (declaracionId: string) => {
    const userId = auth.currentUser?.uid
    if (!userId) return false

    try {
      return await declaracionSharing.isSharedByUser(declaracionId, userId)
    } catch (error) {
      console.error('Error checking if sentence is shared:', error)
      return false
    }
  }

  const loadSharedSentences = async () => {
    const userId = auth.currentUser?.uid
    if (!userId) return []

    try {
      return await declaracionSharing.getSharedDeclaraciones(userId)
    } catch (error) {
      console.error('Error loading shared sentences:', error)
      return []
    }
  }

  const getSharedCount = (declaracionId: string) => {
    const declaracion = declaracionesStore.declaraciones.find(d => d.id === declaracionId)
    return declaracion?.compartidos || 0
  }

  return {
    addSentence,
    editSentence,
    deleteSentence,
    shareSentence,
    unshareSentence,
    isShared,
    loadSharedSentences,
    getSharedCount
  }
}
