
const routes = [
  {
    path: '/',
    redirect: '/fr'
  },
  {
    path: '/:lang',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'immobilier',
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
