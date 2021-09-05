import Vue from "vue";
import App from "./App.vue";

//引入插件
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";
import ElementUI from "element-ui";
import router from "./router";
import WebRTC from "vue-webrtc";
Vue.config.productionTip = false;

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
  autoConnect: true, // 自动连接     这里为我项目需求  需要在指定情况下才连接socket
};

Vue.use(
  new VueSocketio({
    debug: false,
    // connection: SocketIO("http://127.0.0.1:7001", socketOptions),
    connection: "http://127.0.0.1:7001",
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
    receive(data) {
      if (data.group) {
        console.log("收到群消息", data);
      } else {
        console.log("收到好友消息", data);
      }

      this.$store.commit("addSingleMessage", {
        user: data.user,
        group: data.group,
        message: data.message,
        route: data.group ? data.group._id : data.user._id, //如果有group 代表他是一个群
      });
      this.$store.commit("setChatingCount", data);
      this.$store.commit("setChatingTimeAndMessage", {
        people: data.user,
        message: data.message,
        group: data.group,
      });
    },
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
