import { createApp } from 'vue';

import '@/assets/css/index.less';

import packages from '@/packages'; // 三方库的引入

import App from './App.vue';

const app = createApp(App);

app.use(packages);

app.mount('#app');
