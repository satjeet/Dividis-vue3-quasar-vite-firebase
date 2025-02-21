import type { IDeclaracionSharing } from '../types/interfaces/IDeclaracionSharing'
import type { Declaracion } from '../types/declaracion'
import { auth, db } from '../firebase'
import { doc, updateDoc, getDoc, DocumentReference, DocumentData } from 'firebase/firestore'
import { FieldValue, arrayUnion, arrayRemove } from 'firebase/firestore'

export class DeclaracionSharing implements IDeclaracionSharing {
  async shareDeclaracion(declaracion: Declaracion, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`)
      const userViajeRef = doc(db, 'usuarios', userId, 'datos', 'viaje')

      // Update the public declaration
      await updateDoc(docRef, {
        declaraciones: await this.updateDeclaracionesArray(docRef, declaracion.id, (decl) => ({
          ...decl,
          compartidos: (decl.compartidos || 0) + 1,
          usuariosCompartieron: [...(decl.usuariosCompartieron || []), userId]
        }))
      })

      // Add to user's viaje
      const viajeSnap = await getDoc(userViajeRef)
      if (viajeSnap.exists()) {
        const viajeData = viajeSnap.data()
        const declaracionesCompartidas = viajeData.declaracionesCompartidas || []

        if (!declaracionesCompartidas.some((d: Declaracion) => d.id === declaracion.id)) {
          await updateDoc(userViajeRef, {
            declaracionesCompartidas: [...declaracionesCompartidas, {
              ...declaracion,
              esCompartida: true
            }]
          })
        }
      } else {
        await updateDoc(userViajeRef, {
          declaracionesCompartidas: [{
            ...declaracion,
            esCompartida: true
          }]
        })
      }
    } catch (error) {
      console.error('Error sharing declaracion:', error)
      throw error
    }
  }

  async unshareDeclaracion(declaracion: Declaracion, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`)
      const userViajeRef = doc(db, 'usuarios', userId, 'datos', 'viaje')

      // Update the public declaration
      await updateDoc(docRef, {
        declaraciones: await this.updateDeclaracionesArray(docRef, declaracion.id, (decl) => ({
          ...decl,
          compartidos: Math.max(0, (decl.compartidos || 0) - 1),
          usuariosCompartieron: (decl.usuariosCompartieron || []).filter((id: string) => id !== userId)
        }))
      })

      // Remove from user's viaje
      const viajeSnap = await getDoc(userViajeRef)
      if (viajeSnap.exists()) {
        const viajeData = viajeSnap.data()
        const declaracionesCompartidas = viajeData.declaracionesCompartidas || []
        await updateDoc(userViajeRef, {
          declaracionesCompartidas: declaracionesCompartidas.filter(
            (d: Declaracion) => d.id !== declaracion.id
          )
        })
      }
    } catch (error) {
      console.error('Error unsharing declaracion:', error)
      throw error
    }
  }

  async getSharedDeclaraciones(userId: string): Promise<Declaracion[]> {
    try {
      const userViajeRef = doc(db, 'usuarios', userId, 'datos', 'viaje')
      const viajeSnap = await getDoc(userViajeRef)

      if (viajeSnap.exists()) {
        const viajeData = viajeSnap.data()
        return viajeData.declaracionesCompartidas || []
      }
      return []
    } catch (error) {
      console.error('Error getting shared declaraciones:', error)
      throw error
    }
  }

  async syncSharedStatus(declaracion: Declaracion): Promise<void> {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) throw new Error('Usuario no autenticado')

      const userViajeRef = doc(db, 'usuarios', userId, 'datos', 'viaje')
      const viajeSnap = await getDoc(userViajeRef)

      if (viajeSnap.exists()) {
        const viajeData = viajeSnap.data()
        const isShared = viajeData.declaracionesCompartidas?.some(
          (d: Declaracion) => d.id === declaracion.id
        ) ?? false

        if (isShared && declaracion.usuariosCompartieron?.includes(userId)) {
          await this.unshareDeclaracion(declaracion, userId)
        }
      }
    } catch (error) {
      console.error('Error syncing shared status:', error)
      throw error
    }
  }

  async updateSharedCount(declaracionId: string, increment: boolean): Promise<void> {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Usuario no autenticado')

    const declaracion = await this.findDeclaracionById(declaracionId)
    if (!declaracion) throw new Error('Declaración no encontrada')

    if (increment) {
      await this.shareDeclaracion(declaracion, userId)
    } else {
      await this.unshareDeclaracion(declaracion, userId)
    }
  }

  async isSharedByUser(declaracionId: string, userId: string): Promise<boolean> {
    try {
      const userViajeRef = doc(db, 'usuarios', userId, 'datos', 'viaje')
      const viajeSnap = await getDoc(userViajeRef)

      if (viajeSnap.exists()) {
        const viajeData = viajeSnap.data()
        return viajeData.declaracionesCompartidas?.some(
          (d: Declaracion) => d.id === declaracionId
        ) ?? false
      }
      return false
    } catch (error) {
      console.error('Error checking if declaracion is shared:', error)
      throw error
    }
  }

  private async findDeclaracionById(declaracionId: string): Promise<Declaracion | null> {
    // First check in all category-pilar combinations
    const categories = ['Salud', 'Personalidad', 'Intelecto', 'Carrera', 'Finanzas', 'CalidadDeVida', 'Emocionalidad', 'Relaciones']
    const pilares = ['Vision', 'Proposito', 'Creencias', 'Estrategias']

    for (const categoria of categories) {
      for (const pilar of pilares) {
        const docRef = doc(db, 'declaracionesPublicas', `${categoria}-${pilar}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          const found = data.declaraciones?.find((d: Declaracion) => d.id === declaracionId)
          if (found) return found
        }
      }
    }

    return null
  }

  private async updateDeclaracionesArray(
    docRef: DocumentReference<DocumentData>,
    declaracionId: string,
    updateFn: (decl: Declaracion) => Declaracion
  ): Promise<Declaracion[]> {
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return []

    const data = docSnap.data() as { declaraciones: Declaracion[] }
    return data.declaraciones.map((decl: Declaracion) =>
      decl.id === declaracionId ? updateFn(decl) : decl
    )
  }
}
