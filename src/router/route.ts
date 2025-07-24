import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/page-content/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/home-page/index.vue'),
        meta: {
          isShowPageHeader: true,
        },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/components/categories/index.vue'),
        meta: {
          isShowPageHeader: true,
        },
      },
      {
        path: 'label',
        component: () => import('@/components/label/index.vue'),
        meta: {
          isShowPageHeader: true,
        },
      },
      {
        path: 'achieve',
        component: () => import('@/components/achieve/index.vue'),
        meta: {
          isShowPageHeader: true,
        },
      },
      {
        path: 'wiki',
        component: () => import('@/components/wiki/index.vue'),
        meta: {
          isShowPageHeader: true,
        },
      },
    ],
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('@/components/article/index.vue'),
  },
  {
    path: '/wiki/:id',
    name: 'WikiDetail',
    component: () => import('@/components/wiki-detail/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/login/index.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/admin/index.vue'),
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: 'article',
        name: 'AdminArticle',
        component: () => import('@/components/wiki/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
];

export default routes;
