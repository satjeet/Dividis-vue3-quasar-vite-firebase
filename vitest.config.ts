import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const config = {
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
    __DEV__: 'true',
    __TEST__: 'true'
  }
} as const

export default defineConfig({
  ...config,
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
    }
  }
})
