import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: async () => import('@/pages/Home/index.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: async () => import('@/pages/History/index.vue')
    }
  ]
});

export default router;
