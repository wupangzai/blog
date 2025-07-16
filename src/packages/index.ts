import ElementUI from './element-plus';
import type { App } from 'vue';

const packagesList = [ElementUI];

// 以插件形式注册
export default {
  install(app: App) {
    packagesList.forEach((packageModule) => {
      app.use(packageModule);
    });
  },
};
