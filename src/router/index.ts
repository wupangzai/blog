import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './route';

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior() {
    // 总是滚动到顶部
    return { top: 0 };
  },
});

export default router;
