import type { Category } from './viaje'

export interface IViajeStore {
  // State
  categories: Category[]
  cambiosSinGuardar: number
  datosCargados: boolean
  categoriaSeleccionada: string
  pilarSeleccionado: string
  pilars: string[]

  // Getters
  isContadorCero: boolean
  hasPendingChanges: boolean

  // Actions
  setCategoriaSeleccionada: (categoria: string) => void
  setPilarSeleccionado: (pilar: string) => void
  addCategory: (category: Category) => void
  addSentence: (categoryName: string, pilarName: string, sentence: string) => void
  editSentence: (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) => void
  deleteSentence: (categoryName: string, pilarName: string, sentenceIndex: number) => void
  guardarCambiosFirebase: () => Promise<void>
  cargaInicialColeccionFirebase: () => Promise<void>
}

export interface ViajeStoreState {
  categories: Category[]
  cambiosSinGuardar: number
  datosCargados: boolean
  categoriaSeleccionada: string
  pilarSeleccionado: string
  modifiedCategories: Set<string>
}

export type ViajeStoreGetters = {
  isContadorCero: boolean
  hasPendingChanges: boolean
}

export type ViajeStoreActions = {
  setCategoriaSeleccionada: (categoria: string) => void
  setPilarSeleccionado: (pilar: string) => void
  addCategory: (category: Category) => void
  addSentence: (categoryName: string, pilarName: string, sentence: string) => void
  editSentence: (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) => void
  deleteSentence: (categoryName: string, pilarName: string, sentenceIndex: number) => void
  guardarCambiosFirebase: () => Promise<void>
  cargaInicialColeccionFirebase: () => Promise<void>
}
