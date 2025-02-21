import type { Declaracion } from '../declaracion'

export interface IDeclaracionSharing {
  shareDeclaracion(declaracion: Declaracion, userId: string): Promise<void>
  unshareDeclaracion(declaracion: Declaracion, userId: string): Promise<void>
  getSharedDeclaraciones(userId: string): Promise<Declaracion[]>
  syncSharedStatus(declaracion: Declaracion): Promise<void>
  updateSharedCount(declaracionId: string, increment: boolean): Promise<void>
  isSharedByUser(declaracionId: string, userId: string): Promise<boolean>
}
