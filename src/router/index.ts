import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import routes from './routes'
import { auth } from '../firebase'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    // Verifica si la ruta requiere autenticación
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    // Comprueba si el usuario está autenticado
    const isAuthenticated = auth.currentUser

    if (requiresAuth && !isAuthenticated) {
      // Si el usuario no está autenticado y la ruta requiere autenticación, redirige a la página principal
      next('/')
    } else {
      // Si todo está bien, continúa con la navegación
      next()
    }
  })

  return Router
})
