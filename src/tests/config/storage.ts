/**
 * @fileoverview Mock Storage implementation for testing
 * @module test/config/storage
 */

/**
 * Implementation of the Web Storage API for testing
 * Provides a fully functional mock of localStorage and sessionStorage
 *
 * @class StorageImpl
 * @implements {Storage}
 *
 * @example
 * ```ts
 * const storage = new StorageImpl()
 * storage.setItem('key', 'value')
 * const value = storage.getItem('key') // 'value'
 * ```
 */
export class StorageImpl implements Storage {
  /** Internal storage using Map for key-value pairs */
  private store = new Map<string, string>()

  /**
   * Returns the number of stored items
   * @returns {number} The number of key-value pairs
   */
  get length(): number {
    return this.store.size
  }

  /**
   * Removes all key-value pairs from storage
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Retrieves the value associated with the given key
   * @param {string} key - The key to look up
   * @returns {string | null} The value if found, null otherwise
   *
   * @example
   * ```ts
   * storage.setItem('user', 'John')
   * const user = storage.getItem('user') // 'John'
   * const missing = storage.getItem('missing') // null
   * ```
   */
  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  /**
   * Returns the key at the specified index
   * @param {number} index - Zero-based index of the key
   * @returns {string | null} The key if found, null if index out of bounds
   *
   * @example
   * ```ts
   * storage.setItem('a', '1')
   * storage.setItem('b', '2')
   * const firstKey = storage.key(0) // 'a'
   * const outOfBounds = storage.key(99) // null
   * ```
   */
  key(index: number): string | null {
    const keys = Array.from(this.store.keys())
    return keys[index] ?? null
  }

  /**
   * Removes the key-value pair with the given key
   * @param {string} key - The key to remove
   *
   * @example
   * ```ts
   * storage.setItem('temp', 'value')
   * storage.removeItem('temp')
   * const value = storage.getItem('temp') // null
   * ```
   */
  removeItem(key: string): void {
    this.store.delete(key)
  }

  /**
   * Sets a value for the given key
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   *
   * @example
   * ```ts
   * storage.setItem('user', 'John')
   * storage.setItem('prefs', JSON.stringify({ theme: 'dark' }))
   * ```
   */
  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  /**
   * Returns a JSON representation of the storage contents
   * Useful for debugging and testing
   * @returns {Record<string, string>} Object with all key-value pairs
   *
   * @example
   * ```ts
   * storage.setItem('a', '1')
   * storage.setItem('b', '2')
   * console.log(storage.toJSON()) // { a: '1', b: '2' }
   * ```
   */
  toJSON(): Record<string, string> {
    return Object.fromEntries(this.store)
  }

  /**
   * Returns all keys in storage
   * @returns {string[]} Array of all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys())
  }

  /**
   * Returns all values in storage
   * @returns {string[]} Array of all values
   */
  values(): string[] {
    return Array.from(this.store.values())
  }

  /**
   * Returns all entries in storage
   * @returns {[string, string][]} Array of key-value pairs
   */
  entries(): [string, string][] {
    return Array.from(this.store.entries())
  }

  /**
   * Checks if a key exists in storage
   * @param {string} key - The key to check
   * @returns {boolean} True if key exists, false otherwise
   */
  has(key: string): boolean {
    return this.store.has(key)
  }
}
