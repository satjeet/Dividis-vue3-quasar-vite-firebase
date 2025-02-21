/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@vue/test-utils" />

import type { ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'

export type TestWrapper<T extends ComponentPublicInstance = ComponentPublicInstance> = VueWrapper<T>

// Global declarations
declare global {
  // Window extensions
  interface Window {
    ResizeObserver: ResizeObserverConstructor
    matchMedia: (query: string) => MediaQueryList
  }

  // Node.js global extensions
  namespace NodeJS {
    interface Global {
      ResizeObserver: ResizeObserverConstructor
      matchMedia: (query: string) => MediaQueryList
    }
  }
}

// ResizeObserver types
interface ResizeObserverConstructor {
  new(callback: ResizeObserverCallback): ResizeObserver
  prototype: ResizeObserver
}

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void
}

interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
}

interface ResizeObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  disconnect(): void
}

// MediaQuery types
interface MediaQueryList {
  matches: boolean
  media: string
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null
  addListener(listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void
  removeListener(listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void
  dispatchEvent(event: Event): boolean
}

// Vitest extensions
declare module 'vitest' {
  interface TestContext {
    ResizeObserver: ResizeObserverConstructor
    matchMedia: (query: string) => MediaQueryList
  }
}
