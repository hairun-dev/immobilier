
const routes = [
  {
    path: '/:lang',
    name: 'home',
    component: () => import('src/layouts/FrontLayout.vue'),
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
