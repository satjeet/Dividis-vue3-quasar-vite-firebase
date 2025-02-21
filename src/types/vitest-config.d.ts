/// <reference types="vite/client" />

declare module 'vite' {
  interface CoverageConfig {
    provider: 'v8' | 'istanbul' | 'c8'
    reporter: string[]
    exclude: string[]
    include?: string[]
    all?: boolean
    clean?: boolean
  }

  interface DepsConfig {
    inline: string[]
    fallbackCJS?: boolean
  }

  interface TestConfig {
    globals: boolean
    environment: string
    setupFiles: string[]
    include: string[]
    exclude: string[]
    root: string
    deps: DepsConfig
    reporters: string[]
    silent: boolean
    coverage: CoverageConfig
    clearMocks: boolean
    restoreMocks: boolean
    mockReset: boolean
    testTimeout: number
    hookTimeout: number
    isolate?: boolean
  }

  interface UserConfig {
    test: TestConfig
    css?: {
      modules?: {
        scopeBehaviour?: 'global' | 'local'
        localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
      }
      preprocessorOptions?: {
        scss?: {
          additionalData?: string
          includePaths?: string[]
        }
        less?: Record<string, any>
        sass?: Record<string, any>
      }
      devSourcemap?: boolean
    }
  }
}
