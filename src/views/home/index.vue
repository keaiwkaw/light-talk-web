<template>
  <div class="flex w-full h-full">
    <Contact />
    <Chat />
  </div>
</template>

<script>
import Contact from "@/components/contact/index.vue";
import Chat from "@/components/chat/index.vue";
import { getFriends, getGroups } from "@/service/getData";
import {
  getSessionStorage,
  getLocalStorage,
  getChatingPeople,
} from "@/utils/localOps";
import pyjs from "js-pinyin";
export default {
  components: {
    Chat,
    Contact,
  },
  sockets: {},
  data() {
    return {
      list: [],
      join: [],
      management: [],
    };
  },
  methods: {
    getInfFromLocalStorage() {
      //获取当前用户
      let user = getSessionStorage("user") || {};
      this.$store.commit("setUser", user);
      let userID = getSessionStorage("userID") || "";

      //获取当前正在聊天的人
      let curPeople = getSessionStorage("curPeople") || {};
      this.$store.commit("setCurPeople", curPeople);
      //获取会话列表
      let chating = getChatingPeople() || [];
      this.$store.commit("initChating", chating);
      //获取历史记录
      let historyChat = getLocalStorage("historyChat") || {};
      this.$store.commit("initHistoryChat", historyChat);
    },
    async getFriendList() {
      let res = await getFriends({ selfID: getSessionStorage("userID") });
      if (res.code == 200) {
        this.list = res.friends;
      }
      this.format();
    },
    format() {
      let p,
        c,
        d = { "#": [] };
      let blocks = [];
      this.list.forEach((item) => {
        p = pyjs
          .getFullChars(item.notename || item.nickname)
          .toLocaleLowerCase()
          .slice(0, 1);
        c = p.charCodeAt(0);
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = [];
          }
          d[p].push(item);
        } else {
          d["#"].push(item);
        }
      });
      for (let [k, v] of Object.entries(d)) {
        if (k != "#") {
          blocks.push({
            title: k.toUpperCase(),
            friend: v,
          });
        }
      }
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      if (d["#"].length) {
        blocks.push({
          title: "#",
          friend: d["#"],
        });
      }
      this.$store.commit("setFriendList", blocks);
    },
    async getGroupList() {
      let res = await getGroups({
        selfID: getSessionStorage("userID"),
      });
      if (res.code == 200) {
        let groups = res.groups;
        // console.log(res);
        //群成员 0 群猪 2 管理1
        for (let i = 0; i < groups.length; i++) {
          let myGroups = groups[i].groupMembers;
          for (let j = 0; j < myGroups.length; j++) {
            if (
              myGroups[j].type != 0 &&
              myGroups[j].user._id == getSessionStorage("userID")
            ) {
              this.management.push(groups[i]);
            } else if (
              myGroups[j].user._id == getSessionStorage("userID") &&
              myGroups[j].type == 0
            ) {
              this.join.push(groups[i]);
            }
          }
        }
      }
      //  存到vuex中
      this.$store.commit("setGroupList", {
        join: this.join,
        management: this.management,
      });
      //获取完用户之后将用户的群传入rooms里面
      this.$socket.emit("addGroup", {
        userGroups: [...this.join, ...this.management],
      });
    },
  },
  created() {
    this.getInfFromLocalStorage();
    this.getFriendList();
    this.getGroupList();
    this.$socket.open();
  },
  mounted() {},
};
</script>

<style  scoped>
</style>