import type { Mock } from 'vitest'

declare global {
  interface Window {
    ResizeObserver: any
  }
}

declare module '@vue/test-utils' {
  interface DOMWrapper {
    exists(): boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string) => string
    $route: {
      params: Record<string, string>
      query: Record<string, string>
      path: string
    }
    $router: {
      push: Mock
      replace: Mock
      go: Mock
      back: Mock
    }
    $q: {
      dark: {
        isActive: boolean
        set: Mock
      }
      notify: Mock
      loading: {
        show: Mock
        hide: Mock
      }
      dialog: {
        create: Mock
      }
    }
  }
}

export {}
