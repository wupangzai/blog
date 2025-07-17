import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: import('@/components/page-content/index.vue'),
  },
];

export default routes;
