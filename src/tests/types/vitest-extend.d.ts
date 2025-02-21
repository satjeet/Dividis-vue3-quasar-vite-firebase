declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveBeenCalledWith(...args: any[]): T
    toHaveBeenCalled(): T
    toBeInstanceOf(constructor: Function): T
    toHaveProperty(property: string): T
    toBeDefined(): T
    toBeNull(): T
    toBe(value: any): T
    toEqual(value: any): T
  }

  interface AsymmetricMatchersContaining {
    toHaveBeenCalledWith(...args: any[]): any
    toHaveBeenCalled(): any
    toBeInstanceOf(constructor: Function): any
    toHaveProperty(property: string): any
    toBeDefined(): any
    toBeNull(): any
    toBe(value: any): any
    toEqual(value: any): any
  }
}

export {}
