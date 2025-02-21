export interface Sentence {
  id?: string
  content: string
  createdAt?: Date
  updatedAt?: Date
  categoryId?: string
  pilarId?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface SentenceInput {
  content: string
  categoryId?: string
  pilarId?: string
  metadata?: Record<string, any>
}

export interface SentenceFilter {
  categoryId?: string
  pilarId?: string
  userId?: string
  fromDate?: Date
  toDate?: Date
}

export interface SentenceUpdate {
  content?: string
  metadata?: Record<string, any>
}

export type SentenceList = Sentence[]

export interface SentenceStats {
  total: number
  byCategory: Record<string, number>
  byPilar: Record<string, number>
}

export interface SentenceOperationResult {
  success: boolean
  message?: string
  data?: Sentence | SentenceList
  error?: Error
}

// Type guards
export function isSentence(obj: any): obj is Sentence {
  return (
    obj &&
    typeof obj === 'object' &&
    'content' in obj &&
    typeof obj.content === 'string'
  )
}

export function isSentenceList(obj: any): obj is SentenceList {
  return (
    Array.isArray(obj) &&
    obj.every(item => isSentence(item))
  )
}
