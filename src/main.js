import Vue from "vue";
import App from "./App.vue";
import {uuid} from "@/utils/util";
//引入插件
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";
import ElementUI from "element-ui";
import router from "./router";
import WebRTC from "vue-webrtc";
Vue.config.productionTip = false;
Vue.prototype.$uuid = uuid;
// 引入组件

//引入css

import "tailwindcss/tailwind.css";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/reset.css";
import "./assets/css/gloaba.css";
import store from "./store";
import {getSessionStorage} from "@/utils/localOps";
import {VueFilter} from "@/utils/filter";
//安装  插件
const socketOptions = {
  autoConnect: false, // 自动连接
};

Vue.use(
  new VueSocketio({
    debug: false,
    connection: SocketIO("http://127.0.0.1:7001", socketOptions),
    // connection: "http://127.0.0.1:7001",
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);
Vue.use(ElementUI);
Vue.use(WebRTC);
VueFilter(Vue);

// console.log(VueFilter)

//混入方法

Vue.mixin({
  computed: {
    uploadUrl() {
      return "http://127.0.0.1:7001/upload";
    },
  },
});

//event BUs

class Bus {
  constructor() {
    this.callbacks = {};
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}
Vue.prototype.$bus = new Bus();
// new Vue 实例
new Vue({
  sockets: {
    connect() {
      this.$socket.emit("addPeople", {
        userID: getSessionStorage("userID"),
        socketID: this.$socket.id,
      });
      console.log("connect success");
    },
    disconnect() {
      this.$socket.emit("deletePeople", {
        userID: getSessionStorage("userID"),
        socketID: this.$socket.id,
      });
      console.log("disconnect success");
    },
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
