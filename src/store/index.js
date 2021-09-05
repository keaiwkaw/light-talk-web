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
    groupList: [],
    friendList: [],
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
      let {people, message, group} = obj;
      const {chating} = state;
      let id = people._id;
      if (group) {
        id = group._id;
      }
      for (let i = 0; i < chating.length; i++) {
        if (id == chating[i]._id) {
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
      const {user, message, route, group} = data;
      const {chating} = state;
      let isAdd = true;
      for (let i = 0; i < chating.length; i++) {
        if (chating[i]._id == route) {
          isAdd = false;
        }
      }
      if (isAdd) {
        if (group) {
          chating.push(group);
        } else {
          chating.push(user);
        }
      }
      if (!state.historyChat[route]) {
        Vue.set(state.historyChat, route, []);
      }
      state.historyChat[route].push({
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
        let id = data.user._id; //好友消息
        if (data.group) {
          id = data.group._id; //群聊消息
        }
        if (chating[i]._id == id) {
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
    /* 
      获取群聊列表
    */
    setGroupList(state, data) {
      state.groupList = data;
    },
    setFriendList(state, data) {
      state.friendList = data;
    },
  },
  getters: {
    getUserSocketID: (state) => (id) => {
      return state.onlineMap[id] || "";
    },
  },
});

export default store;
