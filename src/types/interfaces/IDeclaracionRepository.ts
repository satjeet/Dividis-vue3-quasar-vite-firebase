import type { Declaracion } from '../declaracion'

export interface IDeclaracionRepository {
  loadDeclaraciones(): Promise<Declaracion[]>
  saveDeclaracion(declaracion: Declaracion): Promise<void>
  updateDeclaracion(declaracion: Declaracion): Promise<void>
  deleteDeclaracion(id: string, categoria: string, pilar: string): Promise<void>
  transferDeclaracion(id: string, nuevoPropietarioId: string, categoria: string, pilar: string): Promise<void>
}
