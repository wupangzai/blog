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
    meta: {
      isShowPageHeader: true,
    },
  },
  {
    path: '/wiki/:id',
    name: 'WikiDetail',
    component: () => import('@/components/wiki-detail/index.vue'),
    meta: {
      isShowPageHeader: true,
    },
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
        path: '',
        name: 'AdminDashBoard',
        component: () => import('@/components/admin/components/admin-dash-board/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'article',
        name: 'AdminArticle',
        component: () => import('@/components/admin/components/admin-article/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'category',
        name: 'AdminCategory',
        component: () => import('@/components/admin/components/admin-category/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'tag',
        name: 'AdminTag',
        component: () => import('@/components/admin/components/admin-tag/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'wiki',
        name: 'AdminWiki',
        component: () => import('@/components/admin/components/admin-wiki/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'comment',
        name: 'AdminComment',
        component: () => import('@/components/admin/components/admin-comment/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'notice',
        name: 'AdminNotice',
        component: () => import('@/components/admin/components/admin-notice/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'blogSetting',
        name: 'AdminBlog',
        component: () => import('@/components/admin/components/admin-blog-setting/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
];

export default routes;
