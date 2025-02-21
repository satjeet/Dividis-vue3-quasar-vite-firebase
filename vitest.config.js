import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const isCI = Boolean(process.env.CI)
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@test',
        replacement: path.resolve(__dirname, 'src/tests')
      },
      {
        find: '@types',
        replacement: path.resolve(__dirname, 'src/types')
      }
    ]
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __DEV__: String(!isProduction),
    __TEST__: 'true'
  },
  test: {
    // Core settings
    name: 'Dividis Tests',
    dir: './src/tests',
    globals: true,
    environment: 'happy-dom',
    environmentMatchGlobs: [
      ['**/*.dom.{test,spec}.{js,ts}', 'happy-dom'],
      ['**/*.node.{test,spec}.{js,ts}', 'node']
    ],

    // File patterns
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/**/__tests__/*.{js,jsx,ts,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],

    // Setup and initialization
    setupFiles: ['./src/tests/setup.ts'],
    globalSetup: ['./src/tests/setup-global.ts'],
    testNamePattern: '.*',
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: isCI,
        minThreads: isCI ? 2 : 1,
        maxThreads: isCI ? 4 : 8
      }
    },

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/types/**',
        '**/*.{test,spec}.{js,ts}',
        '**/__tests__/**'
      ],
      all: true,
      clean: true,
      cleanOnRerun: true,
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },

    // Reporting and output
    reporters: [
      'default',
      'html',
      isCI && 'junit'
    ].filter(Boolean),
    outputFile: {
      html: './test-results/html',
      json: './test-results/results.json',
      junit: './test-results/junit.xml'
    },

    // Performance and execution
    maxConcurrency: isCI ? 4 : 10,
    minThreads: isCI ? 2 : 1,
    maxThreads: isCI ? 4 : 8,
    fileParallelism: !isCI,
    isolate: true,
    sequence: {
      hooks: isCI ? 'serial' : 'parallel',
      shuffle: false
    },

    // Timeouts and retries
    testTimeout: isCI ? 15000 : 10000,
    hookTimeout: isCI ? 10000 : 5000,
    teardownTimeout: 5000,
    retry: isCI ? 2 : 0,
    bail: isCI ? 5 : 0,

    // Dependencies and transforms
    deps: {
      inline: [
        'vue',
        '@vue',
        /\.vue$/,
        /\.[jt]sx?$/
      ],
      interopDefault: true,
      external: [
        '**/node_modules/**'
      ],
      fallbackCJS: true,
      moduleDirectories: ['node_modules']
    },

    // Test behavior
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    unstubEnvs: true,
    unstubGlobals: true,
    passWithNoTests: false,
    allowOnly: !isCI,
    dangerouslyIgnoreUnhandledErrors: false,
    typecheck: {
      checker: 'tsc',
      include: ['**/*.{test,spec}.ts?(x)']
    }
  }
})
