import Vue from "vue";
import VueRouter from "vue-router";
import login from "@/views/login";
import home from "@/views/index";
import addFriends from "@/views/add-friends";
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
    name: "index",
    component: home,
  },
  {
    path: "/chat/:id",
    name: "chating",
    component: home,
  },
  {
    path: "/addFriends",
    name: "addFriends",
    component: addFriends,
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
