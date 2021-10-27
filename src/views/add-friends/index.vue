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
    <friend-res
      v-if="cascaderValue[0] != 'groups'"
      :searchRes="searchRes"
      :requestRes="requestRes"
      :isAddfriend="isAddfriend"
      :userID="userID"
      @dealRequestAdd="dealRequestAdd"
      @sendRequestAdd="sendRequestAdd"
    />
    <!-- 类容结束 -->
    <!--群类容  -->
    <group-res
      v-else
      :searchRes="searchRes"
      :requestRes="requestRes"
      :isAddfriend="isAddfriend"
      :userID="userID"
      @dealRequestAdd="dealRequestAdd"
      @sendRequestAdd="sendRequestAdd"
    />
    <!-- 群类容结束 -->
  </div>
</template>

<script>
import GroupRes from "./GroupRes";
import FriendRes from "./FriendRes";
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
  components: {
    GroupRes,
    FriendRes,
  },
  data() {
    return {
      userID: getSessionStorage("userID"),
      cascaderValue: ["friends", "passing"],
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
    //获取请求列表
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
    //处理请求
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
    //发送添加请求
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
  
  },
};
</script>

<style  scoped>
</style>