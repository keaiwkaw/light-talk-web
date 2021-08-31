import Vue from "vue";
import VueRouter from "vue-router";
import login from "@/views/login";
import home from "@/views/home";
import test from "@/views/test";
import addAndDule from "@/components/addAndDule";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      isPublic: true,
    },
  },
  {
    path: "/",
    name: "home",
    component: home,
  },
  {
    path: "/chat/:id",
    name: "chatToPeople",
    component: home,
  },
  {
    path: "/addAndDule",
    name: "addAndDule",
    component: addAndDule,
  },
  {
    path: "/test",
    name: "test",
    component: test,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

// 路由守卫
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !window.sessionStorage.token) {
    return next("/login");
  }
  next();
});
export default router;
