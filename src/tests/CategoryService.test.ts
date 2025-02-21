import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CategoryService } from '../services/CategoryService'
import { useViajeStore } from '../stores/viaje-store'

// Mock the Pinia store
vi.mock('../stores/viaje-store', () => ({
  useViajeStore: vi.fn(() => ({
    categories: [],
    datosCargados: false,
    addCategory: vi.fn(),
    addSentence: vi.fn(),
    editSentence: vi.fn(),
    deleteSentence: vi.fn(),
    setCategoriaSeleccionada: vi.fn(),
    setPilarSeleccionado: vi.fn(),
    guardarCambiosFirebase: vi.fn(),
    cargaInicialColeccionFirebase: vi.fn(),
    isContadorCero: true,
    categoriaSeleccionada: '',
    pilarSeleccionado: ''
  }))
}))

describe('CategoryService', () => {
  let categoryService: CategoryService
  let mockStore: ReturnType<typeof useViajeStore>

  beforeEach(() => {
    vi.clearAllMocks()
    categoryService = new CategoryService()
    mockStore = useViajeStore()
  })

  describe('getCategoryByName', () => {
    it('should find category by exact name match', () => {
      const mockCategories = [
        { name: 'Salud', pilars: [] },
        { name: 'Intelecto', pilars: [] }
      ]
      ;(mockStore as any).categories = mockCategories

      const result = categoryService.getCategoryByName('Salud')
      expect(result).toEqual(mockCategories[0])
    })

    it('should return undefined for non-existent category', () => {
      const result = categoryService.getCategoryByName('NonExistent')
      expect(result).toBeUndefined()
    })
  })

  describe('addCategory', () => {
    it('should add a new category with all default pilars', () => {
      const categoryName = 'TestCategory'
      const initialPilar = { name: 'Vision', sentences: ['Test sentence'] }

      categoryService.addCategory(categoryName, initialPilar)

      expect(mockStore.addCategory).toHaveBeenCalledWith({
        name: categoryName,
        pilars: [
          { name: 'Vision', sentences: ['Test sentence'] },
          { name: 'Proposito', sentences: [] },
          { name: 'Creencias', sentences: [] },
          { name: 'Estrategias', sentences: [] }
        ]
      })
    })

    it('should not add duplicate category', () => {
      const categoryName = 'ExistingCategory'
      ;(mockStore as any).categories = [{ name: categoryName, pilars: [] }]

      categoryService.addCategory(categoryName, { name: 'Vision', sentences: [] })
      expect(mockStore.addCategory).not.toHaveBeenCalled()
    })
  })

  describe('initializeDefaultCategories', () => {
    it('should create all default categories if none exist', () => {
      const result = categoryService.initializeDefaultCategories()

      expect(result).toBe(true)
      expect(mockStore.addCategory).toHaveBeenCalledTimes(8) // 8 default categories
    })

    it('should not recreate existing categories', () => {
      ;(mockStore as any).categories = [
        { name: 'Salud', pilars: [] },
        { name: 'Intelecto', pilars: [] }
      ]

      const result = categoryService.initializeDefaultCategories()

      expect(result).toBe(true)
      expect(mockStore.addCategory).toHaveBeenCalledTimes(6) // 8 - 2 existing
    })
  })

  describe('getPilarByName', () => {
    it('should find pilar in category', () => {
      const mockPilar = { name: 'Vision', sentences: [] }
      ;(mockStore as any).categories = [{
        name: 'TestCategory',
        pilars: [mockPilar]
      }]

      const result = categoryService.getPilarByName('TestCategory', 'Vision')
      expect(result).toEqual(mockPilar)
    })

    it('should return undefined for non-existent pilar', () => {
      const result = categoryService.getPilarByName('TestCategory', 'NonExistent')
      expect(result).toBeUndefined()
    })
  })
})
