import type { IViajeStore } from './store'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // Here we can add custom properties for all stores
    viajeStore: IViajeStore
  }

  export interface PiniaCustomStateProperties<S> {
    // Here we can add custom state properties for all stores
    $viajeStore?: IViajeStore
  }

  export interface DefineStoreOptionsBase<S, Store> {
    // Here we can add custom options for all stores
    persistState?: boolean
  }
}
