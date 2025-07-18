import ElementUI from './element-plus';
import http from '@/packages/axios';
import AOS from '@/packages/aos';
import type { App } from 'vue';

const packagesList = [ElementUI, http];

// 以插件形式注册
export default {
  install(app: App) {
    packagesList.forEach((packageModule) => {
      app.use(packageModule);
    });

    AOS.init({
      duration: 1200,
    });
  },
};
