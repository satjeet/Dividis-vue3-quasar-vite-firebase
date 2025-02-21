declare module '@vue/test-utils' {
  import { ComponentPublicInstance } from 'vue'

  interface DOMWrapper<T extends Node> {
    element: T
    exists(): boolean
    isVisible(): boolean
    trigger(eventName: string): Promise<void>
    setValue(value: string | number | boolean): Promise<void>
    text(): string
    html(): string
    find<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>
    findAll<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>[]
  }

  interface VueWrapper<T extends ComponentPublicInstance> extends DOMWrapper<Node> {
    vm: T
    emitted(): Record<string, unknown[]>
    props(): Record<string, unknown>
    unmount(): void
  }

  interface MountingOptions<Props> {
    props?: Props
    slots?: Record<string, unknown>
    attrs?: Record<string, unknown>
    global?: {
      plugins?: unknown[]
      mixins?: unknown[]
      mocks?: Record<string, unknown>
      provide?: Record<string, unknown>
      components?: Record<string, unknown>
      directives?: Record<string, unknown>
      stubs?: Record<string, unknown>
    }
  }

  export function mount<T extends ComponentPublicInstance>(
    component: Parameters<typeof defineComponent>[0],
    options?: MountingOptions<T extends ComponentPublicInstance<infer Props> ? Props : never>
  ): VueWrapper<T>
}

declare module '@vue/test-utils/dist/interfaces' {
  export interface DOMWrapper<T extends Node> {
    element: T
    exists(): boolean
    isVisible(): boolean
    trigger(eventName: string): Promise<void>
    setValue(value: string | number | boolean): Promise<void>
    text(): string
    html(): string
    find<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>
    findAll<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>[]
  }

  export interface VueWrapper<T extends ComponentPublicInstance> extends DOMWrapper<Node> {
    vm: T
    emitted(): Record<string, unknown[]>
    props(): Record<string, unknown>
    unmount(): void
  }

  export interface MountingOptions<Props> {
    props?: Props
    slots?: Record<string, unknown>
    attrs?: Record<string, unknown>
    global?: {
      plugins?: unknown[]
      mixins?: unknown[]
      mocks?: Record<string, unknown>
      provide?: Record<string, unknown>
      components?: Record<string, unknown>
      directives?: Record<string, unknown>
      stubs?: Record<string, unknown>
    }
  }
}
