import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/NonAuthLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') }
    ]
  },
  {
    path: '/viaje',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/ViajePage.vue') } // Eliminamos 'viaje' duplicado aquí
    ]
  },
  {
    path: '/declaraciones',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/DeclaracionesPage.vue') }
    ]
  },
  {
    path: '/categoria/:category/pilar/:pilar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'CategoryPilarPage',
        component: () => import('pages/CategoryPilarPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
