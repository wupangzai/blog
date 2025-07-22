import router from '@/router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useCookie } from '@/hooks';

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const cookieAuthorization = useCookie('Authorization');
    console.log('[ cookieAuthorization ] >', cookieAuthorization);
    if (to.meta.requireAuth && !cookieAuthorization.get()) {
      next('/login');
    } else {
      next();
    }
  }
);
