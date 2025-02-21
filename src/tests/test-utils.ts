import type { DOMTestUtils, SpyInstance } from '../types/test-utils'
import type { Component } from 'vue'

type AnyComponent = Component
type TimerId = number & { readonly brand: unique symbol }

interface MockTimer {
  id: TimerId
  callback: Function
  args: any[]
  delay: number
  next: number
}

interface TimerController {
  setTimeout(callback: Function, delay?: number, ...args: any[]): TimerId
  clearTimeout(id: TimerId): void
  advanceTimersByTime(ms: number): void
  runAllTimers(): void
  reset(): void
}

/**
 * Creates a DOM test environment for Vue components
 */
export const createTestUtils = (): DOMTestUtils => {
  const cleanup = () => {
    if (typeof document !== 'undefined') {
      document.body.innerHTML = ''
    }
  }

  const render = <T = any>(component: T) => {
    if (typeof document === 'undefined') {
      throw new Error('Document is not defined')
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    return {
      container,
      unmount() {
        container.remove()
        cleanup()
      }
    }
  }

  const createEvent = (type: string, options: any = {}) => {
    if (typeof window === 'undefined') {
      return { type, ...options }
    }
    return new Event(type, options)
  }

  const fireEvent = {
    click: async (element: Element) => {
      const event = typeof window !== 'undefined'
        ? new MouseEvent('click', { bubbles: true })
        : createEvent('click', { bubbles: true })
      element.dispatchEvent(event)
    },
    change: async (element: Element, value: any) => {
      if (element instanceof HTMLInputElement) {
        element.value = value
        const event = createEvent('change', { bubbles: true })
        element.dispatchEvent(event)
      }
    },
    submit: async (element: Element) => {
      const event = createEvent('submit', { bubbles: true })
      element.dispatchEvent(event)
    },
    focus: async (element: Element) => {
      const event = createEvent('focus', { bubbles: true })
      element.dispatchEvent(event)
    },
    blur: async (element: Element) => {
      const event = createEvent('blur', { bubbles: true })
      element.dispatchEvent(event)
    },
    keyDown: async (element: Element, key: string) => {
      const event = typeof window !== 'undefined'
        ? new KeyboardEvent('keydown', { key, bubbles: true })
        : createEvent('keydown', { key, bubbles: true })
      element.dispatchEvent(event)
    },
    keyUp: async (element: Element, key: string) => {
      const event = typeof window !== 'undefined'
        ? new KeyboardEvent('keyup', { key, bubbles: true })
        : createEvent('keyup', { key, bubbles: true })
      element.dispatchEvent(event)
    },
    keyPress: async (element: Element, key: string) => {
      const event = typeof window !== 'undefined'
        ? new KeyboardEvent('keypress', { key, bubbles: true })
        : createEvent('keypress', { key, bubbles: true })
      element.dispatchEvent(event)
    }
  }

  return { render, cleanup, fireEvent }
}

/**
 * Creates a spy for a function
 */
export const createSpy = <T extends (...args: any[]) => any>(
  impl?: T
): SpyInstance<T> => {
  const calls: Parameters<T>[] = []
  const results: Array<{ type: 'return' | 'throw'; value: ReturnType<T> }> = []
  const instances: any[] = []
  let lastCall: Parameters<T> | undefined
  const invocationCallOrder: number[] = []
  let callCount = 0

  const spy = ((...args: Parameters<T>) => {
    calls.push(args)
    lastCall = args
    invocationCallOrder.push(++callCount)

    try {
      const result = impl?.(...args)
      results.push({ type: 'return', value: result })
      return result
    } catch (error) {
      results.push({ type: 'throw', value: error as any })
      throw error
    }
  }) as SpyInstance<T>

  spy.mock = {
    calls,
    results,
    instances,
    lastCall: lastCall ?? ([] as unknown as Parameters<T>),
    invocationCallOrder,
    getMockName: () => 'spy',
    mockClear: () => {
      calls.length = 0
      results.length = 0
      instances.length = 0
      lastCall = undefined
      invocationCallOrder.length = 0
      callCount = 0
    },
    mockReset: () => {
      spy.mock.mockClear()
      impl = undefined
    },
    mockRestore: () => {
      spy.mock.mockReset()
    }
  }

  return spy
}

/**
 * Creates timer functions
 */
export function createTimers(): TimerController {
  let now = Date.now()
  const timers = new Map<TimerId, MockTimer>()
  let nextTimerId = 1

  return {
    setTimeout(callback: Function, delay = 0, ...args: any[]) {
      const id = nextTimerId++ as TimerId
      timers.set(id, {
        id,
        callback,
        args,
        delay,
        next: now + delay
      })
      return id
    },
    clearTimeout(id: TimerId) {
      timers.delete(id)
    },
    advanceTimersByTime(ms: number) {
      now += ms
      const due = [...timers.values()]
        .filter(timer => timer.next <= now)
        .sort((a, b) => a.next - b.next)

      for (const timer of due) {
        timers.delete(timer.id)
        timer.callback(...timer.args)
      }
    },
    runAllTimers() {
      while (timers.size > 0) {
        const nextTime = Math.min(
          ...Array.from(timers.values()).map(t => t.next)
        )
        now = nextTime
        this.advanceTimersByTime(0)
      }
    },
    reset() {
      now = Date.now()
      timers.clear()
      nextTimerId = 1
    }
  }
}
