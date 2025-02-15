import { computed } from 'vue';
import { useViajeStore } from '../stores/viaje-store';
import { useUserStore } from '../stores/user-store';
import { categorias, pilares } from '../constants/declaraciones';
import type { Declaracion } from '../types/declaracion';

export function useUnlockedContent() {
  const viajeStore = useViajeStore();
  const userStore = useUserStore();

  const getUnlockedCategories = computed(() => {
    const userCategories = viajeStore.categories.map(cat => cat.name);
    return categorias.filter(categoria =>
      userCategories.includes(categoria)
    );
  });

  const getUnlockedPillars = computed(() => {
    const unlockedPillars = new Set<string>();

    viajeStore.categories.forEach(category => {
      category.pilars.forEach(pilar => {
        unlockedPillars.add(pilar.name);
      });
    });

    return pilares.filter(pilar =>
      unlockedPillars.has(pilar)
    );
  });

  const isContentUnlocked = (categoria: string, pilar: string): boolean => {
    const categoryData = viajeStore.categories.find(cat => cat.name === categoria);
    if (!categoryData) return false;

    return categoryData.pilars.some(p => p.name === pilar);
  };

  const filterUnlockedDeclaraciones = (declaraciones: Declaracion[]): Declaracion[] => {
    return declaraciones.filter(decl =>
      isContentUnlocked(decl.categoria, decl.pilar)
    );
  };

  return {
    unlockedCategories: getUnlockedCategories,
    unlockedPillars: getUnlockedPillars,
    isContentUnlocked,
    filterUnlockedDeclaraciones
  };
}
