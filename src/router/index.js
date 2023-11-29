import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: async () => import('@/pages/Home.vue')
    },

    {
      path: '/current',
      name: 'current',
      component: async () => import('@/pages/Current.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: async () => import('@/pages/History.vue')
    }
  ]
});

export default router;
