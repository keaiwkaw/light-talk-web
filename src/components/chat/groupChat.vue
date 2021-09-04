<template>
  <div class="messageBox h-4/6 mt-3 flex flex-row-reverse">
    <div
      class="group-people w-4/12 overflow-y-hidden flex flex-col border-t-2 border-l-2"
      v-if="isShow"
    >
      <div class="public h-20 pl-2 border-b-2 nowrap-hidden">
        <p>公告：</p>
        {{ $store.state.curPeople.groupOfPublic }}
      </div>
      <div class="group-item w-full h-full overflow-y-scroll">
        <div
          class="flex py-2 items-center ml-3"
          v-for="(item, idx) in $store.state.curPeople.groupMembers"
          :key="idx"
        >
          <img :src="item.user.avatar" alt="" class="w-10 rounded-full" />
          <div class="text-sm ml-2 nowrap-hidden">{{ item.user.nickname }}</div>
        </div>
      </div>
    </div>

    <!-- 指示区 -->
    <div class="position h-20 fixed">
      <!-- 左箭头 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 absolute -top-10 -left-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-show="!isShow"
        @click="isShow = !isShow"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 17l-5-5m0 0l5-5m-5 5h12"
        />
      </svg>
      <!--  右箭头-->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 absolute -top-10 -left-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-show="isShow"
        @click="isShow = !isShow"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </div>
    <div class="group-chat flex-1 overflow-y-scroll" ref="hideScrollBar">
      <div
        v-for="(item, idx) in $store.state.historyChat[$route.params.id]"
        :key="idx"
        class="w-full mb-5 px-2"
      >
        <div
          :class="{ 'flex-row-reverse': item.user._id == userID }"
          class="flex justify-start w-full items-center"
        >
          <img :src="item.user.avatar" alt="" class="w-10 h-10" />
          <p
            class="rounded-xl bg-gray-400 max-w-lg flex justify-center items-center p-2 mx-3"
          >
            {{ item.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
import { mapState } from "vuex";
export default {
  data() {
    return {
      userID: getSessionStorage("userID"),
      list: new Array(10).fill({
        nickname: "田浩伟",
        avatar: "http://topurl.cn/7YT",
      }),
      isShow: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.hideScrollBar.scrollTop = 99999999;
    });
  },
  computed: {
    ...mapState(["historyChat"]),
  },
  watch: {
    historyChat: {
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          this.$refs.hideScrollBar.scrollTop = 99999999;
        });
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  display: none;
}
textarea {
  background: none !important;
  outline: none;
}
</style>