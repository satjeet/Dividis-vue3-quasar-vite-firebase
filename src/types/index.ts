// Store types
export * from './store'

// Domain types
export * from './viaje'
export * from './sentence'
export * from './declaracion'

// Interface types
export * from './interfaces/IRepository'
export * from './interfaces/ISentenceRepository'
export * from './interfaces/IViajeRepository'
export * from './interfaces/ICategoryManager'
export * from './interfaces/IExperienceManager'
export * from './interfaces/IDeclaracionRepository'
export * from './interfaces/IDeclaracionSharing'

// Type augmentations
export * as PiniaTypes from './pinia'

// Types utilities
export type DeepRequired<T> = {
  [K in keyof T]: T[K] extends object
    ? DeepRequired<T[K]>
    : Required<T[K]>
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}

export type Nullable<T> = T | null

export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
  T extends (...args: any[]) => Promise<infer R> ? R : any

// Common type aliases
export type Dict<T = any> = { [key: string]: T }
export type VoidFn = () => void
export type AnyFn = (...args: any[]) => any
export type UnknownFn = (...args: unknown[]) => unknown

// Type guards
export type TypeGuard<T> = (value: unknown) => boolean
export type AsyncTypeGuard<T> = (value: unknown) => Promise<boolean>

// Store-specific types
export type StoreAction<T = void> = () => Promise<T>
export type StoreMutation<T = void> = (payload?: any) => T
export type StoreGetter<T> = () => T

// Service types
export type ServiceResult<T = any> = {
  success: boolean
  data?: T
  error?: Error
  message?: string
}

export type ServiceResponse<T = any> = Promise<ServiceResult<T>>
export type ServiceHandler<T = any, Args extends any[] = any[]> = (...args: Args) => ServiceResponse<T>

// Firebase types
export type FirebaseDocumentData = Dict
export type FirebaseDocument<T = FirebaseDocumentData> = T & { id: string }
export type FirebaseTimestamp = { seconds: number; nanoseconds: number }

// Common predicates
export type Predicate<T> = (value: T) => boolean
export type AsyncPredicate<T> = (value: T) => Promise<boolean>
