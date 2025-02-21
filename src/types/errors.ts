export interface Result<T> {
  success: boolean
  data?: T
  error?: Error
  message?: string
}

export interface ApiError extends Error {
  code: string
  message: string
  details?: Record<string, any>
}

export class RepositoryError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message)
    this.name = 'RepositoryError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export function isResult<T>(obj: any): obj is Result<T> {
  return obj && typeof obj === 'object' && 'success' in obj
}

export function isError(obj: any): obj is Error {
  return obj instanceof Error
}

export function createSuccessResult<T>(data: T): Result<T> {
  return {
    success: true,
    data
  }
}

export function createErrorResult<T>(error: Error | string): Result<T> {
  const message = typeof error === 'string' ? error : error.message
  return {
    success: false,
    error: typeof error === 'string' ? new Error(error) : error,
    message
  }
}
