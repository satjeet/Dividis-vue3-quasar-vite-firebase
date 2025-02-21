import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const config = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@test': path.resolve(__dirname, '.'),
      '@types': path.resolve(__dirname, '../types')
    }
  },
  define: {
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __DEV__: JSON.stringify(true),
    __TEST__: JSON.stringify(true)
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: [
      'src/**/*.{test,spec}.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist'
    ],
    root: '.',
    setupFiles: [
      './src/tests/setup.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/tests/**',
        '**/*.d.ts'
      ]
    },
    deps: {
      inline: ['vue']
    },
    threads: true,
    isolate: true,
    maxConcurrency: 5,
    maxWorkers: 2,
    minWorkers: 1,
    testTimeout: 10000,
    hookTimeout: 10000,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    watch: false,
    sequence: {
      hooks: 'parallel',
      shuffle: false
    },
    environmentOptions: {
      happyDOM: {
        console: true,
        navigator: true,
        window: true
      }
    }
  }
}

export default defineConfig(config)
