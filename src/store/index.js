import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  setChatingPeople,
  setSessionStorage,
  setLocalStorage,
} from "@/utils/localOps";
Vue.use(Vuex);

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    user: null,
    show: false,
    onlineMap: null,
    curPeople: null,
    chating: [],
    historyChat: {},
  },
  mutations: {
    /* 
      设置用户
    */
    setUser(state, user) {
      state.user = user;
      setSessionStorage("user", state.user);
    },
    /* 
    展示除侧边框之外的部分
    */
    changeShow(state) {
      state.show = !state.show;
    },
    /* 
      socket 方法 ，设置在人
    */
    SOCKET_setOnline(state, data) {
      state.onlineMap = data;
      setSessionStorage("onlineMap", state.onlineMap);
    },
    /* 
      当前正在聊天的人
    */
    setCurPeople(state, people) {
      state.curPeople = people;
      setSessionStorage("curPeople", state.curPeople);
    },
    /* 
    添加会话列表
    */
    addChating(state, data) {
      let {chating} = state;

      let i;
      for (i = 0; i < chating.length; i++) {
        if (data._id == chating[i]._id) {
          break;
        }
      }
      if (i < chating.length) {
        chating.splice(i, 1);
      }
      chating.unshift(data);

      setChatingPeople(chating);
    },
    /* 
    初始化会话列表
    */
    initChating(state, data) {
      state.chating = data;
    },
    /* 
      设置最后会话时间和会话类容
    */
    setChatingTimeAndMessage(state, obj) {
      let {people, message} = obj;
      const {chating} = state;
      for (let i = 0; i < chating.length; i++) {
        if (people._id == chating[i]._id) {
          chating[i].endMessage = message;
          Vue.set(chating[i], "endMessage", message);
          Vue.set(chating[i], "endTime", new Date().getTime());
          setChatingPeople(chating);
          break;
        }
      }
    },
    /* 
    设置历史记录
    */
    setHistoryChat(state, data) {
      const {curMessage, curID} = data;
      state.historyChat[curID] = curMessage;
      setLocalStorage("historyChat", state.historyChat);
    },
    /* 
    init 历史记录
    */
    initHistoryChat(state, data) {
      state.historyChat = data;
    },
    //添加单条历史
    addSingleMessage(state, data) {
      const {user, message, route} = data;
      let id = user._id;
      if (route) {
        id = route;
      }
      if (!state.historyChat[id]) {
        Vue.set(state.historyChat, id, []);
      }
      state.historyChat[id].push({
        user,
        message,
      });
      setLocalStorage("historyChat", state.historyChat);
    },
    /* 
    设置 小红点的显示
    */
    setChatingCount(state, data) {
      const {chating} = state;
      for (let i = 0; i < chating.length; i++) {
        if (chating[i]._id == data.user._id) {
          if (!chating[i].count) {
            Vue.set(chating[i], "count", 0);
          }
          let count = chating[i].count;
          chating[i].count = ++count;
          break;
        }
      }
      setChatingPeople(chating);
    },
    /* 
      清除小红点
    */
    clearChatingCount(state, data) {
      let id = data._id;
      for (let i = 0; i < state.chating.length; i++) {
        if (state.chating[i]._id == id) {
          state.chating[i].count = 0;
        }
      }
      setChatingPeople(state.chating);
    },
  },
  getters: {
    getUserSocketID: (state) => (id) => {
      return state.onlineMap[id] || "";
    },
  },
});

export default store;
