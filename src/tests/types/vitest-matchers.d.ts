export interface BaseMatchers<R = void> {
  toBe(expected: any): R
  toEqual(expected: any): R
  toStrictEqual(expected: any): R
  toBeNull(): R
  toBeUndefined(): R
  toBeDefined(): R
  toBeTruthy(): R
  toBeFalsy(): R
  toContain(expected: any): R
  toThrow(message?: string | RegExp): R
  toBeLessThanOrEqual(n: number): R
  toBeGreaterThanOrEqual(n: number): R
  toHaveLength(length: number): R
  toHaveProperty(key: string, value?: any): R
  toBeInstanceOf(constructor: Function): R
  toMatch(pattern: string | RegExp): R
  toMatchObject(object: object): R
  toMatchSnapshot(name?: string): R
  toMatchInlineSnapshot(snapshot: string): R
  not: BaseMatchers<R>
}

export interface AsyncMatchers<R = void> extends BaseMatchers<Promise<R>> {
  rejects: AsyncMatchers<R>
  resolves: AsyncMatchers<R>
  toHaveBeenCalled(): Promise<R>
  toHaveBeenCalledTimes(times: number): Promise<R>
  toHaveBeenCalledWith(...args: any[]): Promise<R>
  toHaveBeenLastCalledWith(...args: any[]): Promise<R>
  toHaveBeenNthCalledWith(n: number, ...args: any[]): Promise<R>
}

export interface Matchers<R = void> extends BaseMatchers<R> {
  toBeVisible(): R
  toBeHidden(): R
  toHaveClass(className: string | string[]): R
  toHaveStyle(style: string | Record<string, any>): R
  toHaveAttribute(key: string, value?: string): R
  toHaveEmitted(event: string, ...args: any[]): R
  toHaveEmittedTimes(event: string, times: number): R
  toHaveElement(selector: string): R
  toHaveComponent(component: any): R
  toBeInStore(): R
  toHaveStoreState(expected: any): R
  toHaveGetterValue(getterName: string, expected: any): R
  toHaveMutation(type: string, payload?: any): R
  toHaveAction(type: string, payload?: any): R
  rejects: AsyncMatchers<Promise<R>>
  resolves: AsyncMatchers<Promise<R>>
}
