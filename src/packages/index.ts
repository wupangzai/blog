import ElementUI from './element-plus';
import http from '@/packages/axios';
import AOS from '@/packages/aos';
import type { App } from 'vue';
import VueECharts from '@/packages/vue-charts';
import '@/packages/md-editor-v3';

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

    app.component('VChart', VueECharts);
  },
};
