<template>
  <div class="flex w-full h-full">
    <Contact />
    <Chat />
  </div>
</template>

<script>
import Contact from "@/components/contact/index.vue";
import Chat from "@/components/chat/index.vue";
import {
  getSessionStorage,
  getLocalStorage,
  getChatingPeople,
} from "@/utils/localOps";
export default {
  components: {
    Chat,
    Contact,
  },
  sockets: {},
  data() {
    return {};
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
  },
  created() {
    this.getInfFromLocalStorage();
  },
  mounted() {},
};
</script>

<style  scoped>
</style>