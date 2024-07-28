import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

interface Declaracion {
  texto: string;
  pilar: string;
  categoria: string;
}

export const useDeclaracionesStore = defineStore({
  id: 'declaraciones-store',
  state: () => ({
    declaraciones: [] as Declaracion[],
    cambiosSinGuardar: 0 as number
  }),
  actions: {
    agregarDeclaracion (declaracion: Declaracion) {
      this.declaraciones.push(declaracion)
      this.cambiosSinGuardar++
    },
    async guardarCambiosFirebase () {
      const usuarioId = auth.currentUser?.uid
      if (usuarioId) {
        await setDoc(doc(db, 'declaraciones', usuarioId), {
          declaraciones: this.declaraciones
        })
      }
      this.cambiosSinGuardar = 0
    }
  }
})
