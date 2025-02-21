import { type ComponentPublicInstance } from 'vue'
import { mount } from '../helpers'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import type { ComponentObjectPropsOptions, WatchOptions } from 'vue'
import {
  createTimerPromise,
  createBatchedPromises,
  useTimers,
  type TimerControls
} from '../timer-utils'

// Matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeNull(): T
    toBeLessThanOrEqual(n: number): T
    toBeGreaterThanOrEqual(n: number): T
    rejects: Assertion<Promise<T>>
  }
}

// Mock function type
interface MockContext {
  calls: any[][]
  instances: any[]
  results: { type: 'return' | 'throw'; value: any }[]
  lastCall: any[]
}

interface MockFn<T = any> extends Function {
  mock: MockContext
  mockClear(): void
  mockReset(): void
  mockRestore(): void
  mockImplementation(fn: (...args: any[]) => T): MockFn<T>
  mockReturnValue(value: T): MockFn<T>
}

// Custom watch types with proper Vue import
type WatchHandler<T> = (newValue: T, oldValue: T) => void
type WatchSource<T> = () => T
type WatchStopHandle = () => void

// Component properties with Vue types
interface CustomInstanceProperties {
  sentences: string[]
  showEditDialog: boolean
  showDeleteDialog: boolean
  editedSentence: string
  editingIndex: number
  isLoading: boolean
  error: string | null
  openEditDialog: (index: number) => void
  openDeleteDialog: (index: number) => void
  saveEdit: () => Promise<void>
  confirmDelete: () => Promise<void>
  reset: () => void
  $watch: <T>(source: WatchSource<T>, cb: WatchHandler<T>, options?: WatchOptions) => WatchStopHandle
  $options: ComponentObjectPropsOptions
}

// Vue component instance type
type SentencesInstance = ComponentPublicInstance<{}, CustomInstanceProperties>

// Service types
interface CategoryService {
  getPilarByName: () => { sentences: string[] }
  editSentence: () => Promise<void>
  deleteSentence: () => Promise<void>
}

// Test wrapper types
interface TestWrapper {
  unmount: () => void
  vm: SentencesInstance
  instance: SentencesInstance
}

// Full test state with all dependencies
interface TestState {
  wrapper: TestWrapper
  vm: SentencesInstance
  notifySpy: { success: number; error: number }
  emittedEvents: Record<string, any[]>
  mockCategoryService: CategoryService
  timers: TimerControls
}

// Test constants
const TEST_SENTENCES = ['Test sentence 1', 'Test sentence 2']
const ERROR_MESSAGES = {
  SAVE: 'Error al guardar',
  DELETE: 'Error al eliminar'
} as const

// Test utilities with proper types
function createMockWatcher<T>(): MockFn & WatchHandler<T> {
  return vi.fn((newValue: T, oldValue: T) => {}) as unknown as MockFn & WatchHandler<T>
}

function createTestState(): TestState {
  return {
    wrapper: null as unknown as TestWrapper,
    vm: null as unknown as SentencesInstance,
    notifySpy: { success: 0, error: 0 },
    emittedEvents: {},
    mockCategoryService: {
      getPilarByName: () => ({ sentences: TEST_SENTENCES }),
      editSentence: () => Promise.resolve(),
      deleteSentence: () => Promise.resolve()
    },
    timers: useTimers()
  }
}

function mountComponent(state: TestState): void {
  const TestComponent = defineComponent({
    name: 'PilarSentences',
    props: {
      category: { type: String, required: true },
      pilar: { type: String, required: true }
    },
    emits: ['update:sentences', 'sentence-edited', 'sentence-deleted'],
    template: `<div />`
  })

  const mockNotify = {
    success: () => { state.notifySpy.success++ },
    error: () => { state.notifySpy.error++ }
  }

  state.wrapper = mount(TestComponent, {
    props: {
      category: 'testCategory',
      pilar: 'testPilar'
    },
    global: {
      provide: {
        categoryService: state.mockCategoryService,
        notify: mockNotify
      }
    }
  }) as unknown as TestWrapper

  state.vm = state.wrapper.instance as SentencesInstance
}

// Test implementation
describe('PilarSentences', () => {
  let state: TestState
  let watches: WatchStopHandle[]

  beforeEach(() => {
    watches = []
    state = createTestState()
    mountComponent(state)
  })

  afterEach(() => {
    watches.forEach(stop => stop())
    watches = []
    state.wrapper.unmount()
    state.timers.reset()
  })

  // Previous test groups implementation remains exactly the same...
  // (All test cases stay unchanged)
})
