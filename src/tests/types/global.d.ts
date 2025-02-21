/// <reference path="./mocks.d.ts" />

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
    localStorage: Storage
    sessionStorage: Storage
    scrollTo: MockFunction
  }

  interface MediaQueryList {
    matches: boolean
    media: string
    onchange: null
    addListener: MockFunction
    removeListener: MockFunction
    addEventListener: MockFunction
    removeEventListener: MockFunction
    dispatchEvent: MockFunction
  }

  var fetch: MockFunction
  var Request: MockFunction & { prototype: any }
  var Response: MockFunction & { prototype: any }
  var Headers: MockFunction & { prototype: any }
  var FormData: MockFunction & { prototype: any }

  namespace NodeJS {
    interface ProcessEnv {
      VITEST?: string
      TEST?: string
      NODE_ENV?: string
      TZ?: string
      LANG?: string
    }
  }
}

export {}
