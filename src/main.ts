import { createApp } from 'vue';

import '@/assets/css/index.less';

import packages from '@/packages'; // 三方库的引入

import { initApp } from '@/components/common/dialog';

import App from './App.vue';

const app = createApp(App);

app.use(packages);

initApp(app);

app.mount('#app');
