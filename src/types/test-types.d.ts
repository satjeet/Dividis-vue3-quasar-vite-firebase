// Test-specific type declarations
declare global {
  // Generic function type for Vue plugins and mocks
  type VuePluginInstall = (app: any, ...options: any[]) => any

  // Generic plugin interface
  interface VueTestPlugin {
    install: VuePluginInstall
  }

  // Test utility types
  type MockFn = (...args: any[]) => any

  // Test result types
  interface MockResult<T> {
    success: boolean
    data?: T
    error?: Error
  }
}

// Avoid TS error about missing exports
export {}
