
const routes = [
  {
    path: '/',
    redirect: '/fr'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/LoginPage.vue')
  },
  {
    path: '/:lang',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'user',
        component: () => import('src/pages/UserPage.vue')
      },
      {
        path: 'biens',
        name: 'bien',
        component: () => import('src/pages/PropertyPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
