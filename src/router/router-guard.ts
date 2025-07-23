import router from '@/router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useCookie } from '@/hooks';
import { ElNotification } from 'element-plus';

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authorization = useCookie('Authorization').get();

    const goLoginButAuthorizationIsValid = to.path === '/login' && authorization;
    if (goLoginButAuthorizationIsValid) {
      ElNotification({
        message: '请勿重复登录',
        type: 'warning',
      });
      return;
    }

    const goAuthPageWithoutAuthorization = to.meta.requireAuth && !authorization;
    if (goAuthPageWithoutAuthorization) {
      next('/login');
      return;
    }

    next();
  }
);
