declare interface BaseMock {
  (...args: any[]): any
  mockClear(): void
  mockReset(): void
  getMockName(): string
  mock: {
    calls: any[][]
    results: { type: 'return' | 'throw'; value: any }[]
    instances: any[]
    lastCall: any[]
  }
}

declare interface MockFunction extends BaseMock {
  mockResolvedValue<T>(value: T): MockFunction
  mockReturnValue<T>(value: T): MockFunction
  mockImplementation(fn: (...args: any[]) => any): MockFunction
  mockRejectedValue(value: any): MockFunction
}
