import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: (MainLayout) => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'viaje', component: () => import('pages/ViajePage.vue') }]
  },
  {
    path: '/category/:category/pillar/:pillar',
    component: (MainLayout) => import('layouts/MainLayout.vue'),
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
