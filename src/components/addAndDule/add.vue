<template>
  <div class="dule-friends w-full h-full box-border justify-between">
    <div class="tab flex justify-center py-2">
      <div class="addfriends">
        <el-button
          @click="isAddfriend = true"
          :class="{ 'bg-blue-200': isAddfriend }"
          >添加好友</el-button
        >
      </div>
      <div class="deulrequest">
        <el-button
          @click="isAddfriend = false"
          :class="{ 'bg-blue-200': !isAddfriend }"
          >处理请求</el-button
        >
      </div>
    </div>
    <!-- 上面是控制按钮 -->
    <div class="add-friends flex flex-col w-full h-auto" v-if="isAddfriend">
      <div class="control-area w-full mb-2">
        <el-input
          :placeholder="`请输入内容uid/名称-当前搜索状态：${
            select == 'friend' ? '找人' : '找群'
          }`"
          v-model="input"
          class="input-with-select"
          size="medium"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="找人" value="friend"></el-option>
            <el-option label="找群" value="group"></el-option>
          </el-select>
        </el-input>
        <!-- 搜索框 -->
      </div>
      <div class="result-area w-full overflow-y-scroll">
        <div
          class="res-item flex items-center justify-between px-10 pb-1 border-b-2 w-3-"
          v-for="(item, idx) in res"
          :key="idx"
        >
          <div class="flex items-center">
            <img src="http://topurl.cn/7Hu" alt="" class="w-24 h-24" />
            <div class="ml-20 font-medium text-2xl">我是名字</div>
          </div>
          <el-button type="primary" class="w-20 h-10">添加+</el-button>
        </div>
      </div>
    </div>
    <!-- 处理好友请求 -->
    <div v-else>
      <el-cascader
        v-model="cascaderValue"
        :options="cascaderOptions"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChange"
      ></el-cascader>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cascaderValue: ["friends", "passing"],
      isAddfriend: true,
      input: "",
      select: "friend",
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
      res: new Array(10).fill({ name: "田浩伟" }),
    };
  },
  methods: {
    handleChange() {},
  },
};
</script>

<style  scoped>
</style>