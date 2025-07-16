import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./route";

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
