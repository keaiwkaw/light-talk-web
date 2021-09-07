<template>
  <div class="messageBox h-4/6 mt-3 overflow-y-scroll" ref="hideScrollBar">
    <div
      v-for="(item, idx) in $store.state.historyChat[$route.params.id] || []"
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
</template>

<script>
import { mapState } from "vuex";
import { getSessionStorage } from "@/utils/localOps";
export default {
  data() {
    return {
      userID: getSessionStorage("userID"),
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.hideScrollBar) {
        this.$refs.hideScrollBar.scrollTop = this.$refs.hideScrollBar.scrollHeight;
      }
    });
  },
  computed: {
    ...mapState(["historyChat"]),
  },
  watch: {
    historyChat: {
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          if (this.$refs.hideScrollBar) {
            this.$refs.hideScrollBar.scrollTop = this.$refs.hideScrollBar.scrollHeight;
          }
        });
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>