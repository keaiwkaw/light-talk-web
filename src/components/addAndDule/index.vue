<template>
  <div class="addFriends-cmp h-full w-full flex flex-col">
    <div class="tab-group flex justify-center flex-col">
      <div class="tab-area flex justify-center my-2">
        <div class="addfriends">
          <el-button
            @click="isAddfriend = true"
            :class="{ 'bg-blue-200': isAddfriend }"
            >添加好友</el-button
          >
        </div>
        <div class="deulrequest">
          <el-button
            @click="getRequestList"
            :class="{ 'bg-blue-200': !isAddfriend }"
            >处理请求</el-button
          >
        </div>
      </div>
      <div class="control-area flex justify-center pb-2 border-b-2">
        <div class="search-area w-full" v-if="isAddfriend">
          <el-input
            :placeholder="`请输入内容uid/名称-当前搜索状态：${
              select == 'friend' ? '找人' : '找群'
            }`"
            v-model="input"
            class="input-with-select"
            size="medium"
            @keyup="searchFriendToType"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchFriendToType"
            ></el-button>
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="找人" value="user"></el-option>
              <el-option label="找群" value="group"></el-option>
            </el-select>
          </el-input>
          <!-- 搜索框 -->
        </div>
        <div v-else class="cascader w-full flex justify-center">
          <el-cascader
            v-model="cascaderValue"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            class="w-full"
            size="medium"
          ></el-cascader>
        </div>
      </div>
    </div>
    <!-- 类容区 -->
    <div class="search-res flex-1 overflow-y-scroll w-full">
      <!-- 搜人或者群 -->
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
          <img :src="item.people.avatar" alt="" class="w-24 h-24" />
          <div class="ml-20 font-medium text-2xl">
            {{ item.people.nickname }}
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
    </div>
  </div>
</template>

<script>
import {
  searchPeopleToType,
  getRequestList,
  dealRequestAdd,
  sendRequestAdd,
  searchGroupToType 
} from "@/service/getData";
import { getSessionStorage } from "@/utils/localOps";
export default {
  data() {
    return {
      userID: getSessionStorage("userID"),
      cascaderValue: ["friends", "passing"],
      isAddfriend: true,
      input: "",
      select: "user",
      cascaderOptions: [
        {
          value: "friends",
          label: "好友通知",
          children: [
            {
              value: "passing",
              label: "等待处理",
            },
            {
              value: "pass",
              label: "已通过",
            },
            {
              value: "unpass",
              label: "未通过",
            },
          ],
        },
        {
          value: "groups",
          label: "群聊通知",
          children: [
            {
              value: "passing",
              label: "等待处理",
            },
            {
              value: "pass",
              label: "已通过",
            },
            {
              value: "unpass",
              label: "未通过",
            },
          ],
        },
      ],
      // searchRes: new Array(10).fill({ name: "田浩伟" }),
      searchRes: [],
      requestRes: [],
    };
  },
  methods: {
    handleChange() {
      this.getRequestList();
    },
    //根据输入的类容 来获取列表
    async searchFriendToType() {
      let res;
      if (this.select == "group") {
        res = await searchGroupToType({
          value: this.input,
          type: this.select,
          selfID: getSessionStorage("userID"),
        });
      } else {
        res = await searchPeopleToType({
          value: this.input,
          type: this.select,
          selfID: getSessionStorage("userID"),
        });
      }

      if (res.code == 200) {
        this.searchRes = res.list;
      }
    },
    //获取好友请求列表
    async getRequestList() {
      this.isAddfriend = false;
      let res = await getRequestList({
        selfID: getSessionStorage("userID"),
        type: this.cascaderValue[0],
        state: this.cascaderValue[1],
      });
      if (res.code == 200) {
        this.requestRes = res.list;
      }
    },
    //处理好友请求
    async dealRequestAdd(item, code) {
      let res = await dealRequestAdd({
        selfID: getSessionStorage("userID"),
        otherID: item.people,
        code,
      });
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.message,
        });
      }
      this.getRequestList();
    },
    //发送添加好友请求
    async sendRequestAdd(item) {
      let res = await sendRequestAdd({
        selfID: getSessionStorage("userID"),
        otherID: item._id,
        message: "我要加你了",
      });
      if (res.code == 200) {
        let type = "warn";
        if (res.message == "发送请求成功") {
          type = "success";
        }
        this.$message({
          type: type,
          message: res.message,
        });
      }
    },
  },
};
</script>

<style  scoped>
</style>