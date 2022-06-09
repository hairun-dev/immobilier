
const routes = [
  {
    path: '/:lang',
    name: 'home',
    component: () => import('pages/IndexPage.vue'),
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
