import type { Category, Pilar } from './viaje'
import type { ServiceResult } from './index'

// Type guard utility for checking if something is defined
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

// Type guard for objects
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Type guard for arrays
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

// Type guard for Category
export function isCategory(value: unknown): value is Category {
  return (
    isObject(value) &&
    typeof value.name === 'string' &&
    Array.isArray(value.pilars) &&
    value.pilars.every(isPilar)
  )
}

// Type guard for Pilar
export function isPilar(value: unknown): value is Pilar {
  return (
    isObject(value) &&
    typeof value.name === 'string' &&
    Array.isArray(value.sentences) &&
    value.sentences.every(sentence => typeof sentence === 'string')
  )
}

// Type guard for ServiceResult
export function isServiceResult<T>(value: unknown): value is ServiceResult<T> {
  return (
    isObject(value) &&
    typeof value.success === 'boolean' &&
    (value.data === undefined || value.data === null || isObject(value.data)) &&
    (value.error === undefined || value.error instanceof Error) &&
    (value.message === undefined || typeof value.message === 'string')
  )
}

// Type guard for Firebase DocumentData
export function isFirebaseDoc(value: unknown): value is { id: string } {
  return isObject(value) && typeof value.id === 'string'
}

// Type guard for checking string keys
function isStringKey<T>(key: keyof T): key is string & keyof T {
  return typeof key === 'string'
}

// Object validation helpers
export function validateObject<T extends Record<string, unknown>>(
  value: unknown,
  requiredKeys: (keyof T)[],
  typeGuards: Partial<Record<keyof T, (v: unknown) => boolean>>
): value is T {
  if (!isObject(value)) return false

  // Check required keys exist
  for (const key of requiredKeys) {
    if (!isStringKey(key) || !(key in value)) return false
  }

  // Check types using provided guards
  const entries = Object.entries(typeGuards) as [keyof T, ((v: unknown) => boolean) | undefined][]
  for (const [key, guard] of entries) {
    if (guard && isStringKey(key) && key in value && !guard(value[key])) {
      return false
    }
  }

  return true
}

// Array validation helper
export function validateArray<T>(
  value: unknown,
  typeGuard: (v: unknown) => v is T
): value is T[] {
  return Array.isArray(value) && value.every(typeGuard)
}

// Common assertions
export function assertDefined<T>(
  value: T | undefined | null,
  message = 'Value is undefined or null'
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message)
  }
}

export function assertType<T>(
  value: unknown,
  guard: (v: unknown) => v is T,
  message = 'Value is not of expected type'
): asserts value is T {
  if (!guard(value)) {
    throw new Error(message)
  }
}

// Type predicate helper
export function createTypeGuard<T>(predicate: (value: unknown) => boolean): (value: unknown) => value is T {
  return (value: unknown): value is T => predicate(value)
}
