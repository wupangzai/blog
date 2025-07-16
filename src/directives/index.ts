import Loading from '@/directives/loading';
import type { App } from 'vue';
const directiveList = [
  {
    key: 'custom-loading',
    value: Loading,
  },
];

export default {
  install(app: App) {
    directiveList.forEach((directive) => {
      app.directive(directive.key, Loading);
    });
  },
};
