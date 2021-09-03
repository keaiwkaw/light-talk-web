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
              select == 'user' ? '找人' : '找群'
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
    <div
      class="search-res flex-1 overflow-y-scroll w-full"
      v-if="cascaderValue[0] != 'groups'"
    >
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
            :src="item[cascaderValSelect] ? item[cascaderValSelect].avatar : ''"
            alt=""
            class="w-24 h-24"
          />
          <div class="ml-20 font-medium text-2xl">
            {{
              item[cascaderValSelect] ? item[cascaderValSelect].nickname : ""
            }}
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
    <!-- 类容结束 -->

    <!-- 群类容开始 -->
    <div class="search-res flex-1 overflow-y-scroll w-full" v-else>
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
          <img :src="item.avatar" alt="" class="w-24 h-24" />
          <div class="ml-20 font-medium text-2xl flex">
            <div class="user-box flex justify-center items-center mr-7">
              <img :src="item.user.avatar" alt="" class="w-12 h-12" />
              <div class="text-sm ml-2">{{ item.user.nickname }}</div>
            </div>
            <div>{{ item.nickname }}</div>
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
    <!-- 群类容结束 -->
  </div>
</template>

<script>
import {
  searchPeopleToType,
  getRequestList,
  dealRequestAdd,
  sendRequestAdd,
  searchGroupToType,
  sendRequestAddGroup,
  dealRequestAddGroup,
  getRequestListGroup,
} from "@/service/getData";
import { getSessionStorage } from "@/utils/localOps";
export default {
  components: {},
  data() {
    return {
      userID: getSessionStorage("userID"),
      cascaderValue: ["groups", "passing"],
      cascaderValSelect: "people",
      isAddfriend: true,
      input: "",
      select: "user",
      message: "",
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
      if (this.cascaderValue[0] == "friends") {
        this.cascaderValSelect = "people";
        this.getRequestList();
      } else {
        this.cascaderValSelect = "group";
        this.getRequestListGroup();
      }
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
    async getRequestListGroup() {
      this.isAddfriend = false;
      let res = await getRequestListGroup({
        selfID: getSessionStorage("userID"),
        type: this.cascaderValue[1],
      });
      console.log("请求群聊列表", res);
      if (res.code == 200) {
        let list = res.list;
        let ans = [];
        for (let i = 0; i < list.length; i++) {
          let { _id, avatar, nickname, requestList } = list[i];
          for (let j = 0; j < requestList.length; j++) {
            ans.push({
              user: requestList[j].user,
              state: requestList[j].state,
              _id,
              avatar,
              nickname,
            });
          }
        }
        console.log(ans);
        this.requestRes = ans;
      }
    },
    //处理好友请求
    async dealRequestAdd(item, code) {
      let res;
      if (this.cascaderValue[0] == "groups") {
        res = await dealRequestAddGroup({
          code,
          groupID: item._id,
          userID: item.user._id,
        });
        this.getRequestListGroup();
      } else {
        res = await dealRequestAdd({
          selfID: getSessionStorage("userID"),
          otherID: item.people,
          code,
        });
        this.getRequestList();
      }

      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.message,
        });
      }
    },
    //发送添加好友请求
    async sendRequestAdd(item) {
      let res;
      if (this.select == "user") {
        res = await sendRequestAdd({
          selfID: getSessionStorage("userID"),
          otherID: item._id,
          message: "我要加你了",
        });
      } else {
        // console.log("群", item);
        res = await sendRequestAddGroup({
          selfID: getSessionStorage("userID"),
          groupID: item._id,
          message: this.message,
        });
      }
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
    //发送添加群的请求
  },
};
</script>

<style  scoped>
</style>