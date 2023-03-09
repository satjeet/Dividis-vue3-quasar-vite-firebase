import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'viaje', component: () => import('pages/ViajePage.vue') }]
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
