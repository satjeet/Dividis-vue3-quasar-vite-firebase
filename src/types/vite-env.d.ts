/// <reference types="vite/client" />
/// <reference path="./css-modules.d.ts" />

declare module 'vite' {
  interface UserConfig {
    test?: {
      globals?: boolean
      environment?: string
      setupFiles?: string[]
      include?: string[]
      exclude?: string[]
      root?: string
      deps?: {
        inline?: string[]
      }
      reporters?: string[]
      silent?: boolean
      coverage?: {
        provider?: string
        reporter?: string[]
        exclude?: string[]
      }
    }
    plugins?: any[]
    resolve?: {
      alias?: Record<string, string>
      extensions?: string[]
      dedupe?: string[]
    }
    css?: {
      modules?: {
        scopeBehaviour?: 'global' | 'local'
        generateScopedName?: string
        hashPrefix?: string
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
    define?: Record<string, any>
    build?: {
      target?: string | string[]
      outDir?: string
      assetsDir?: string
      sourcemap?: boolean
      minify?: boolean | 'terser' | 'esbuild'
      emptyOutDir?: boolean
      rollupOptions?: Record<string, any>
      cssCodeSplit?: boolean
      lib?: {
        entry: string
        name?: string
        formats?: ('es' | 'cjs' | 'umd' | 'iife')[]
      }
    }
    optimizeDeps?: {
      include?: string[]
      exclude?: string[]
      entries?: string | string[]
      esbuildOptions?: Record<string, any>
    }
    server?: {
      host?: string | boolean
      port?: number
      strictPort?: boolean
      https?: boolean
      open?: boolean | string
      proxy?: Record<string, any>
      cors?: boolean
    }
    preview?: {
      port?: number
      host?: string | boolean
      strictPort?: boolean
      https?: boolean
      open?: boolean | string
      proxy?: Record<string, any>
    }
    esbuild?: {
      jsxFactory?: string
      jsxFragment?: string
    }
  }

  type UserConfigExport = UserConfig | Promise<UserConfig>
  export function defineConfig(config: UserConfigExport): UserConfigExport
}

declare module '@vitejs/plugin-vue' {
  import type { Plugin } from 'vite'
  export default function vue(options?: {
    include?: string | RegExp | (string | RegExp)[]
    exclude?: string | RegExp | (string | RegExp)[]
    customElement?: boolean | string | RegExp | (string | RegExp)[]
    reactivityTransform?: boolean
    template?: {
      compilerOptions?: Record<string, any>
      transformAssetUrls?: Record<string, any>
    }
  }): Plugin
}

declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  [key: string]: any
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
