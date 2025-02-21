import { auth, db } from '../firebase'
import { doc, updateDoc, collection, getDocs, getDoc, setDoc, query, where } from 'firebase/firestore'
import type { IDeclaracionRepository } from '../types/interfaces/IDeclaracionRepository'
import type { Declaracion } from '../types/declaracion'

export class DeclaracionesFirebaseRepository implements IDeclaracionRepository {
  async loadDeclaraciones(): Promise<Declaracion[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'declaracionesPublicas'))
      const declaraciones: Declaracion[] = []

      querySnapshot.forEach(doc => {
        const data = doc.data()
        if (Array.isArray(data.declaraciones)) {
          data.declaraciones.forEach((declaracion: Declaracion) => {
            declaraciones.push({
              ...declaracion,
              esPublica: true
            })
          })
        } else {
          declaraciones.push({
            id: doc.id,
            ...data,
            esPublica: true
          } as Declaracion)
        }
      })

      return declaraciones.sort((a, b) => b.compartidos - a.compartidos)
    } catch (error) {
      console.error("Error loading declaraciones:", error)
      throw error
    }
  }

  async saveDeclaracion(declaracion: Declaracion): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        await updateDoc(docRef, {
          declaraciones: [{ ...declaracion, esPublica: true }, ...data.declaraciones]
        })
      } else {
        await setDoc(docRef, {
          declaraciones: [{ ...declaracion, esPublica: true }]
        })
      }
    } catch (error) {
      console.error("Error saving declaracion:", error)
      throw error
    }
  }

  async updateDeclaracion(declaracion: Declaracion): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const declaracionesFirebase = docSnap.data().declaraciones.map((decl: Declaracion) =>
          decl.id === declaracion.id ? { ...declaracion, esPublica: true } : decl
        )
        await updateDoc(docRef, { declaraciones: declaracionesFirebase })
      }
    } catch (error) {
      console.error("Error updating declaracion:", error)
      throw error
    }
  }

  async deleteDeclaracion(id: string, categoria: string, pilar: string): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${categoria}-${pilar}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const updatedDeclaraciones = data.declaraciones.filter((d: Declaracion) => d.id !== id)
        await updateDoc(docRef, { declaraciones: updatedDeclaraciones })
      }
    } catch (error) {
      console.error('Error deleting declaracion:', error)
      throw error
    }
  }

  async transferDeclaracion(id: string, nuevoPropietarioId: string, categoria: string, pilar: string): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${categoria}-${pilar}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const updatedDeclaraciones = data.declaraciones.map((d: Declaracion) =>
          d.id === id ? { ...d, creadorId: nuevoPropietarioId } : d
        )
        await updateDoc(docRef, { declaraciones: updatedDeclaraciones })
      }
    } catch (error) {
      console.error('Error transferring declaracion:', error)
      throw error
    }
  }
}
