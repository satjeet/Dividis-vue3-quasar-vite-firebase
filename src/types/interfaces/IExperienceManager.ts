export interface IExperienceManager {
  addExperience(amount: number): void
  unlockPilar(categoryName: string, pilarName: string): void
  saveProgress(): Promise<void>
}
