
const routes = [
  {
    path: '/',
    // redirect: { name: 'immobilier' }
    redirect: '/fr'
  },
  {
    path: '/:lang',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'immobilier',
        component: () => import('pages/BienImmobilier.vue')
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
