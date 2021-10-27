<template>
  <div class="search-res flex-1 overflow-y-scroll w-full">
    <div
      class="res-item flex items-center justify-between px-10 pb-1 border-b-2 w-3-"
      v-for="(item, idx) in searchRes"
      :key="idx"
      v-show="isAddfriend"
    >
      <div class="flex items-center">
        <img :src="item.avatar" alt="" class="w-24 h-24" />
        <div class="ml-20 font-medium text-2xl">{{ item.nickname }}</div>
      </div>
      <el-button
        type="primary"
        class="w-20 h-10"
        @click="sendRequestAdd(item)"
        :disabled="item.id == userID"
        >添加+</el-button
      >
    </div>
    <!-- 处理请求 -->
    <div
      class="res-item flex items-center justify-between px-10 pb-1 border-b-2 w-3-"
      v-for="(item, idx) in requestRes"
      :key="idx"
      v-show="!isAddfriend"
    >
      <div class="flex items-center">
        <img
          :src="item.people ? item.people.avatar : ''"
          alt=""
          class="w-24 h-24"
        />
        <div class="ml-20 font-medium text-2xl">
          {{ item.people ? item.people.nickname : "" }}
        </div>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          class="w-20 h-10"
          @click="dealRequestAdd(item, 1)"
          v-if="item.state == 0"
          >同意</el-button
        >
        <el-button
          type="primary"
          class="w-20 h-10"
          @click="dealRequestAdd(item, 2)"
          v-if="item.state == 0"
          >拒绝</el-button
        >
        <el-button
          type="primary"
          class="w-20 h-10"
          v-if="item.state == 1"
          :disabled="true"
          >已通过</el-button
        >
        <el-button
          type="primary"
          class="w-20 h-10"
          v-if="item.state == 2"
          :disabled="true"
          >已拒绝</el-button
        >
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    searchRes: {
      type: Array,
      default: () => [],
    },
    requestRes: {
      type: Array,
      default: () => [],
    },
    isAddfriend: {
      type: Boolean,
    },
    userID: {
      type: String,
    },
  },
  methods: {
    dealRequestAdd(item, code) {
      this.$emit("dealRequestAdd", item, code);
    },
    sendRequestAdd(item) {
      this.$emit("sendRequestAdd", item);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>