import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/page-content/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/home-page/index.vue'),
      },
    ],
  },
];

export default routes;
