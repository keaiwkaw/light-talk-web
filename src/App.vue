<template>
  <div id="app" class="flex justify-center items-center">
    <div
      class="home-page h-5/6 w-4/6 flex justify-center items-center"
      :class="{ 'bg-gray-100': $route.name != 'login' }"
    >
      <Aside v-if="$route.name != 'login'"></Aside>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Aside from "@/components/aside/index.vue";
import {
  setSessionStorage,
  getSessionStorage,
  getLocalStorage,
  getChatingPeople,
} from "@/utils/localOps";
export default {
  components: {
    Aside,
  },
  mounted() {
    // console.log(this.$route);
  },
  created() {
  },
  methods: {
    getInfFromLocalStorage() {
      //获取当前用户
      let user = getSessionStorage("user") || {};
      //获取当前正在聊天的人
      let curPeople = getSessionStorage("curPeople") || {};
      //获取会话列表
      let chating = getChatingPeople() || [];
      //获取历史记录
      let historyChat = getLocalStorage("historyChat") || {};
      this.$store.commit("initHistoryChat", historyChat);
      this.$store.commit("initChating", chating);
      this.$store.commit("setUser", user);
      this.$store.commit("setCurPeople", curPeople);
    },
  },
};
</script>
<style lang="scss">
</style>
