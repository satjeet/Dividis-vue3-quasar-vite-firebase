import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/css/quasar.variables.scss'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './src/tests')
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true,
    'process.env': {}
  },
  build: {
    target: 'esnext',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['@vue/test-utils']
  }
})
