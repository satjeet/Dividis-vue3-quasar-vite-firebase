import type { ComponentPublicInstance, Component } from 'vue'

// Mock function type
export interface MockFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>
  mockImplementation: (fn: T) => this
  mockReturnValue: (value: ReturnType<T>) => this
  mockReset: () => void
  mock: { calls: any[][] }
}

// Vue Test Utils types
export interface DOMWrapperBase {
  text: () => string
  html: () => string
  exists: () => boolean
  trigger: (eventName: string) => Promise<void>
  find: (selector: string) => DOMWrapperBase
  findAll: (selector: string) => DOMWrapperBase[]
}

export interface VueWrapper extends DOMWrapperBase {
  vm: ComponentPublicInstance
  props: () => Record<string, any>
  emitted: () => Record<string, any[]>
  unmount: () => void
}

// Test configuration types
export interface MountConfig {
  props?: Record<string, any>
  slots?: Record<string, any>
  global?: {
    components?: Record<string, Component>
    mocks?: Record<string, any>
    provide?: Record<string, any>
    stubs?: Record<string, any>
  }
}

// Mock result type
export interface MockResult<T> {
  success: boolean
  data?: T
  error?: Error
}

// Router mock types
export interface RouterMock {
  push: MockFn<(to: any) => Promise<void>>
  replace: MockFn<(to: any) => Promise<void>>
  back: MockFn<() => void>
  forward: MockFn<() => void>
  go: MockFn<(delta: number) => void>
}

// Quasar mock types
export interface QuasarMock {
  notify: MockFn<(config: { type: string; message: string }) => void>
  loading: {
    show: MockFn<() => void>
    hide: MockFn<() => void>
  }
  dialog: {
    create: MockFn<(config: any) => any>
  }
  dark: {
    isActive: boolean
    set: MockFn<(value: boolean) => void>
  }
}

// Test context
export interface TestContext {
  wrapper?: VueWrapper
  router?: RouterMock
  quasar?: QuasarMock
}

// Test helper functions
export interface TestUtils {
  mount: (component: Component, options?: MountConfig) => VueWrapper
  createMockFn: <T extends (...args: any[]) => any>(implementation?: T) => MockFn<T>
  createMockRouter: () => RouterMock
  createMockQuasar: () => QuasarMock
}

// Global test declaration
declare global {
  const testUtils: TestUtils
}

export type {
  Component,
  ComponentPublicInstance
}
