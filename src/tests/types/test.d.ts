import { Plugin as VuePlugin } from 'vue'

declare module 'vue' {
  interface Plugin {
    install: (...args: any[]) => any
  }
}
