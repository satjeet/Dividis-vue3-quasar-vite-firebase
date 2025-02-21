import type { IExperienceManager } from '../types/interfaces/IExperienceManager'
import { useUserStore } from '../stores/user-store'

export class ExperienceManager implements IExperienceManager {
  private userStore = useUserStore()
  private readonly PILAR_ORDER = ['Vision', 'Proposito', 'Creencias', 'Estrategias']

  addExperience(amount: number): void {
    this.userStore.addExperience(amount)
  }

  unlockPilar(categoryName: string, pilarName: string): void {
    const currentIndex = this.PILAR_ORDER.indexOf(pilarName)
    if (currentIndex < this.PILAR_ORDER.length - 1) {
      const nextPilar = this.PILAR_ORDER[currentIndex + 1]
      this.userStore.unlockPilar(categoryName, nextPilar)
    }
  }

  async saveProgress(): Promise<void> {
    await this.userStore.saveUserData()
  }

  // Additional utility methods (not part of IExperienceManager interface)
  isPilarUnlocked(categoryName: string, pilarName: string): boolean {
    return this.userStore.isPilarUnlocked(categoryName, pilarName)
  }

  getCurrentExperience(): number {
    return this.userStore.experience
  }

  getUnlockedPilarsByCategory(categoryName: string): string[] {
    return this.userStore.unlockedPilares.filter(pilar =>
      pilar.startsWith(`${categoryName}-`)
    ).map(pilar =>
      pilar.split('-')[1]
    )
  }
}
