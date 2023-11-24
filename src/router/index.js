import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: async () => import('@/pages/Home.vue')
    },

    {
      path: '/current',
      name: 'current',
      component: async () => import('@/pages/Current/index.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: async () => import('@/pages/History/index.vue')
    }
  ]
});

export default router;
