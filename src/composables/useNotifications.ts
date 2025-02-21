import { Notify } from 'quasar'

export function useNotifications() {
  function success(message: string, timeout: number = 2000) {
    Notify.create({
      type: 'positive',
      message,
      position: 'top',
      timeout,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  function error(message: string, timeout: number = 5000) {
    Notify.create({
      type: 'negative',
      message,
      position: 'top',
      timeout,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  function warning(message: string, timeout: number = 3000) {
    Notify.create({
      type: 'warning',
      message,
      position: 'top',
      timeout,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  function info(message: string, timeout: number = 2000) {
    Notify.create({
      type: 'info',
      message,
      position: 'top',
      timeout,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  function loading(message: string = 'Cargando...') {
    const notification = Notify.create({
      type: 'ongoing',
      message,
      position: 'top',
      timeout: 0,
      spinner: true
    })

    return () => {
      notification()
    }
  }

  return {
    success,
    error,
    warning,
    info,
    loading
  }
}
