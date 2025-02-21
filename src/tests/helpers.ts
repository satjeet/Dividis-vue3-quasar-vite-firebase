import { mount as vueMount } from '@vue/test-utils'
import type { ComponentPublicInstance, Component } from 'vue'

export function mount<T extends Component>(
  component: T,
  options: Parameters<typeof vueMount>[1] = {}
) {
  return vueMount(component, {
    ...options,
    attachTo: document.body,
  })
}

export * from '@vue/test-utils'
