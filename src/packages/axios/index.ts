import type { App } from "vue";
import { http } from "@/packages/axios/common";

export default {
  install(app: App) {
    app.config.globalProperties.$http = http;
  },
};
