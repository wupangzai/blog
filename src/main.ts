import { createApp } from 'vue';

import '@/assets/css/index.less';

import packages from '@/packages';

import registerDirectives from '@/directives';

import { initApp } from '@/components/common/dialog';

import { store, key } from '@/store';

import router from '@/router';

import '@/router/router-guard';

import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css'; // 基础样式

import App from './App.vue';

const app = createApp(App);

app.use(packages); // 三方库的引入

app.use(registerDirectives); // 注册自定义指令

app.use(router);

app.use(store, key);

initApp(app);

app.mount('#app');
