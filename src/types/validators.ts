import type { Category, Pilar } from './viaje'
import type { Sentence, SentenceInput } from './sentence'
import type { ServiceResult } from './index'
import { isObject, isDefined } from './guards'

// Validation error
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly path?: string,
    public readonly value?: unknown,
    public readonly expectedType?: string
  ) {
    const fullMessage = path
      ? `${message} at ${path}${expectedType ? ` (expected ${expectedType})` : ''}`
      : message
    super(fullMessage)
    this.name = 'ValidationError'
  }
}

// Basic type guards
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date
}

// Basic validators
export function validateString(value: unknown, path = 'value'): asserts value is string {
  if (!isString(value)) {
    throw new ValidationError(`Invalid string`, path, value, 'string')
  }
}

export function validateBoolean(value: unknown, path = 'value'): asserts value is boolean {
  if (!isBoolean(value)) {
    throw new ValidationError(`Invalid boolean`, path, value, 'boolean')
  }
}

export function validateDate(value: unknown, path = 'value'): asserts value is Date {
  if (!isDate(value)) {
    throw new ValidationError(`Invalid date`, path, value, 'Date')
  }
}

export function validateObject<T extends object>(value: unknown, path = 'value'): asserts value is T {
  if (!isObject(value)) {
    throw new ValidationError(`Invalid object`, path, value, 'object')
  }
}

// Helper functions
export function validateArray<T>(
  value: unknown,
  itemValidator: (item: unknown, path: string) => asserts item is T,
  path = 'value'
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`Invalid array`, path, value, 'array')
  }

  value.forEach((item, index) => {
    try {
      itemValidator(item, `${path}[${index}]`)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new ValidationError(`Invalid array item`, `${path}[${index}]`, item)
    }
  })
}

export function validateOptional<T>(
  value: unknown,
  validator: (v: unknown, path: string) => asserts v is T,
  path = 'value'
): asserts value is T | undefined {
  if (value === undefined) return
  validator(value, path)
}

// Domain validators
export function validatePilar(value: unknown, path = 'pilar'): asserts value is Pilar {
  validateObject<Pilar>(value, path)
  validateString(value.name, `${path}.name`)
  validateArray(value.sentences, validateString, `${path}.sentences`)
}

export function validateCategory(value: unknown, path = 'category'): asserts value is Category {
  validateObject<Category>(value, path)
  validateString(value.name, `${path}.name`)
  validateArray(value.pilars, validatePilar, `${path}.pilars`)
}

export function validateSentence(value: unknown, path = 'sentence'): asserts value is Sentence {
  validateObject<Sentence>(value, path)
  validateString(value.content, `${path}.content`)
  validateOptional(value.id, validateString, `${path}.id`)
  validateOptional(value.categoryId, validateString, `${path}.categoryId`)
  validateOptional(value.pilarId, validateString, `${path}.pilarId`)
  validateOptional(value.userId, validateString, `${path}.userId`)
  validateOptional(value.createdAt, validateDate, `${path}.createdAt`)
  validateOptional(value.updatedAt, validateDate, `${path}.updatedAt`)
  validateOptional(value.metadata, validateObject, `${path}.metadata`)
}

export function validateSentenceInput(value: unknown, path = 'sentenceInput'): asserts value is SentenceInput {
  validateObject<SentenceInput>(value, path)
  validateString(value.content, `${path}.content`)
  validateOptional(value.categoryId, validateString, `${path}.categoryId`)
  validateOptional(value.pilarId, validateString, `${path}.pilarId`)
  validateOptional(value.metadata, validateObject, `${path}.metadata`)
}

export function validateServiceResult<T>(value: unknown, path = 'serviceResult'): asserts value is ServiceResult<T> {
  validateObject<ServiceResult<T>>(value, path)
  validateBoolean(value.success, `${path}.success`)
  validateOptional(value.message, validateString, `${path}.message`)

  if (value.error !== undefined && !(value.error instanceof Error)) {
    throw new ValidationError(`Invalid error`, `${path}.error`, value.error, 'Error')
  }

  if (value.data !== undefined && !isDefined(value.data)) {
    throw new ValidationError(`Invalid data`, `${path}.data`, value.data, 'defined value')
  }
}

// Type predicates
export function isValidCategory(value: unknown): value is Category {
  try {
    validateCategory(value)
    return true
  } catch {
    return false
  }
}

export function isValidPilar(value: unknown): value is Pilar {
  try {
    validatePilar(value)
    return true
  } catch {
    return false
  }
}

export function isValidSentence(value: unknown): value is Sentence {
  try {
    validateSentence(value)
    return true
  } catch {
    return false
  }
}

export function isValidSentenceInput(value: unknown): value is SentenceInput {
  try {
    validateSentenceInput(value)
    return true
  } catch {
    return false
  }
}

// Utility functions
export function validate<T>(
  value: unknown,
  validator: (value: unknown, path: string) => asserts value is T,
  options?: { path?: string; onError?: (error: ValidationError) => void }
): T {
  try {
    validator(value, options?.path ?? 'value')
    return value
  } catch (error) {
    if (error instanceof ValidationError) {
      if (options?.onError) {
        options.onError(error)
      }
      throw error
    }
    throw new ValidationError('Validation failed', options?.path, value)
  }
}

export function withValidation<T, Args extends unknown[], R>(
  validator: (value: unknown) => asserts value is T,
  handler: (value: T, ...args: Args) => R
): (value: unknown, ...args: Args) => R {
  return (value: unknown, ...args: Args) => {
    try {
      validator(value)
      return handler(value, ...args)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new ValidationError('Validation failed in handler', undefined, value)
    }
  }
}

// Type helper for creating type-safe validations
export type Validator<T> = (value: unknown) => asserts value is T
export type ValidationResult<T> = { success: true; value: T } | { success: false; error: ValidationError }

// Helper for safe validation without throwing
export function tryValidate<T>(validator: Validator<T>, value: unknown): ValidationResult<T> {
  try {
    validator(value)
    return { success: true, value }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error }
    }
    return {
      success: false,
      error: new ValidationError('Validation failed', undefined, value)
    }
  }
}
