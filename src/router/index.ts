import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AllOverview from "../components/AllOverview.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: AllOverview,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
