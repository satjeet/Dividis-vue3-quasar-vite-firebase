import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Declaracion } from '../types/declaracion'
import { DeclaracionesFirebaseRepository } from '../repositories/DeclaracionesFirebaseRepository'
import { DeclaracionSharing } from '../services/DeclaracionSharing'

export const useDeclaracionesStore = defineStore('declaraciones', () => {
  // State
  const declaraciones = ref<Declaracion[]>([])
  const repository = new DeclaracionesFirebaseRepository()
  const sharingService = new DeclaracionSharing()

  // Actions
  async function cargarDeclaraciones() {
    try {
      declaraciones.value = await repository.loadDeclaraciones()
      console.log('Declaraciones cargadas:', declaraciones.value)
    } catch (error) {
      console.error("Error al cargar declaraciones:", error)
      throw error
    }
  }

  async function actualizarDeclaracion(declaracion: Declaracion) {
    try {
      // Update local store first for immediate reactivity
      declaraciones.value = declaraciones.value.map(decl =>
        decl.id === declaracion.id ? { ...declaracion, esPublica: true } : decl
      )
      await repository.updateDeclaracion(declaracion)
    } catch (error) {
      console.error("Error al actualizar declaración:", error)
      // Rollback on error
      await cargarDeclaraciones()
      throw error
    }
  }

  async function agregarDeclaracion(declaracion: Declaracion) {
    try {
      // Update local state first
      declaraciones.value = [{ ...declaracion, esPublica: true }, ...declaraciones.value]
      await repository.saveDeclaracion(declaracion)
    } catch (error) {
      // Rollback on error
      declaraciones.value = declaraciones.value.filter(d => d.id !== declaracion.id)
      console.error("Error al agregar declaración:", error)
      throw error
    }
  }

  async function eliminarDeclaracion(declaracion: Declaracion) {
    try {
      // Remove from local state
      declaraciones.value = declaraciones.value.filter(d => d.id !== declaracion.id)
      await repository.deleteDeclaracion(declaracion.id, declaracion.categoria, declaracion.pilar)

      // Also cleanup shared status
      await sharingService.syncSharedStatus(declaracion)
    } catch (error) {
      console.error('Error al eliminar declaración:', error)
      // Rollback on error
      await cargarDeclaraciones()
      throw error
    }
  }

  async function transferirPropiedad(declaracion: Declaracion, nuevoPropietarioId: string) {
    try {
      await repository.transferDeclaracion(
        declaracion.id,
        nuevoPropietarioId,
        declaracion.categoria,
        declaracion.pilar
      )

      // Update local state
      declaraciones.value = declaraciones.value.map(d =>
        d.id === declaracion.id ? { ...d, creadorId: nuevoPropietarioId } : d
      )
    } catch (error) {
      console.error('Error al transferir propiedad:', error)
      // Rollback on error
      await cargarDeclaraciones()
      throw error
    }
  }

  async function compartirDeclaracion(declaracion: Declaracion, userId: string) {
    try {
      await sharingService.shareDeclaracion(declaracion, userId)
      // Update local state
      declaraciones.value = declaraciones.value.map(d =>
        d.id === declaracion.id
          ? {
              ...d,
              compartidos: d.compartidos + 1,
              usuariosCompartieron: [...(d.usuariosCompartieron || []), userId]
            }
          : d
      )
    } catch (error) {
      console.error('Error al compartir declaración:', error)
      throw error
    }
  }

  async function dejarDeCompartir(declaracion: Declaracion, userId: string) {
    try {
      await sharingService.unshareDeclaracion(declaracion, userId)
      // Update local state
      declaraciones.value = declaraciones.value.map(d =>
        d.id === declaracion.id
          ? {
              ...d,
              compartidos: Math.max(0, d.compartidos - 1),
              usuariosCompartieron: (d.usuariosCompartieron || []).filter(id => id !== userId)
            }
          : d
      )
    } catch (error) {
      console.error('Error al dejar de compartir declaración:', error)
      throw error
    }
  }

  return {
    declaraciones,
    cargarDeclaraciones,
    actualizarDeclaracion,
    agregarDeclaracion,
    eliminarDeclaracion,
    transferirPropiedad,
    compartirDeclaracion,
    dejarDeCompartir
  }
})
