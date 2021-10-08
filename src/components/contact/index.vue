<template>
  <div
    class="contact-comp h-full w-72 bg-gray-100  flex flex-col relative border-r-2"
  >
    <div class="tab-group flex h-10 bg-gray-100">
      <div
        class="chats w-1/3 flex justify-center items-center border-r-2 cursor-pointer"
        @click="changeTab(`chats`)"
      >
        <i
          class="el-icon-chat-dot-round text-2xl"
          :class="{ 'text-blue-400': tabName == 'chats' }"
        ></i>
      </div>
      <div
        class="friends w-1/3 flex justify-center items-center border-r-2 cursor-pointer"
        @click="changeTab(`friends`)"
      >
        <i
          class="el-icon-user text-2xl"
          :class="{ 'text-blue-400': tabName == 'friends' }"
        ></i>
      </div>
      <div
        class="groups w-1/3 flex justify-center items-center cursor-pointer"
        @click="changeTab(`groups`)"
      >
        <i
          class="el-icon-message text-2xl"
          :class="{ 'text-blue-400': tabName == 'groups' }"
        ></i>
      </div>
    </div>
    <div class="tabPanel overflow-y-scroll w-full overflow-x-hidden">
      <chatItem v-if="tabName == 'chats'"/>
      <friendItem v-else-if="tabName == 'friends'" />
      <groupItem :list="groups" v-else />
    </div>
  </div>
</template>

<script>
import chatItem from "./chatItem";
import friendItem from "./frienditem";
import groupItem from "./groupitem";
import { getFriends } from "@/service/getData";
import { getStorage } from "@/utils/localOps";
export default {
  components: {
    chatItem,
    friendItem,
    groupItem,
  },
  data() {
    return {
      chats: new Array(20).fill({ avatar: "http://t.hk.uy/Q7C" }),
      friends: [],
      groups: [],
      tabName: "chats",
    };
  },
  methods: {
    changeTab(tabName) {
      this.tabName = tabName;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
</style>