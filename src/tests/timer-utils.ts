export interface TimerControls {
  advance(ms: number): void
  runAll(): void
  runPending(): void
  reset(): void
}

interface TimerState {
  now: number
  isFake: boolean
  pendingTimers: Array<{
    id: number
    callback: () => void
    delay: number
    scheduled: number
  }>
}

interface Timer {
  id: number
  callback: () => void
  delay: number
  scheduled: number
}

const state: TimerState = {
  now: Date.now(),
  isFake: false,
  pendingTimers: []
}

let timerIdCounter = 0

export function createTimerPromise<T>(delay: number, value: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay)
  })
}

export function createDelayedPromise<T>(delay: number, value: T): Promise<T> {
  return createTimerPromise(delay, value)
}

export function createBatchedPromises<T>(values: T[], delay: number): Promise<T[]> {
  return Promise.all(
    values.map((value, i) => createDelayedPromise(delay * i, value))
  )
}

export interface ControlledPromise<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: any) => void
  pending: boolean
}

export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void
  let pending = true

  const promise = new Promise<T>((res, rej) => {
    resolve = (value: T) => {
      pending = false
      res(value)
    }
    reject = (reason?: any) => {
      pending = false
      rej(reason)
    }
  })

  return { promise, resolve, reject, pending }
}

function mockTimer() {
  const original = global.setTimeout
  global.setTimeout = ((callback: Function, delay: number) => {
    if (!state.isFake) {
      return original(callback, delay)
    }

    const id = ++timerIdCounter
    state.pendingTimers.push({
      id,
      callback: () => callback(),
      delay,
      scheduled: state.now + delay
    })
    return id
  }) as any

  return () => {
    global.setTimeout = original
  }
}

export function useTimers(): TimerControls {
  const cleanup = mockTimer()

  const controls: TimerControls = {
    advance(ms: number) {
      if (!state.isFake) return

      state.now += ms
      const maxTime = state.now

      while (state.pendingTimers.length > 0) {
        const nextTimer = state.pendingTimers
          .reduce((earliest, current) =>
            current.scheduled < earliest.scheduled ? current : earliest
          )

        if (nextTimer.scheduled > maxTime) break

        state.pendingTimers = state.pendingTimers.filter(t => t !== nextTimer)
        nextTimer.callback()
      }
    },
    runAll() {
      if (!state.isFake) return

      while (state.pendingTimers.length > 0) {
        const nextTimer = state.pendingTimers[0]
        state.now = nextTimer.scheduled
        state.pendingTimers.shift()
        nextTimer.callback()
      }
    },
    runPending() {
      if (!state.isFake) return

      const now = state.now
      state.pendingTimers
        .filter(timer => timer.scheduled <= now)
        .forEach(timer => {
          state.pendingTimers = state.pendingTimers.filter(t => t !== timer)
          timer.callback()
        })
    },
    reset() {
      cleanup()
      state.isFake = false
      state.pendingTimers = []
      state.now = Date.now()
      timerIdCounter = 0
    }
  }

  state.isFake = true
  return controls
}

// Export for testing
export function resetTimerState() {
  state.now = Date.now()
  state.isFake = false
  state.pendingTimers = []
  timerIdCounter = 0
}
