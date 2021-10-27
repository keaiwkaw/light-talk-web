<template>
  <div
    class="aside-comp bg-primary w-12 h-full flex flex-col justify-between items-center"
  >
    <div
      class="aside-top mt-3 w-full flex justify-center items-center flex-col"
    >
      <img
        :src="avatar"
        alt=""
        class="mt-2 rounded-full w-8 h-8"
        @click="$router.push('/')"
      />
      <p @click="friendsOps" class="cursor-pointer">
        <i class="el-icon-user-solid text-3xl mt-2 text-gray-100"></i>
      </p>
    </div>
    <div class="aside-bottom mb-10" @click="dialogVisible = true">
      <i class="el-icon-setting text-3xl text-gray-100 cursor-pointer"></i>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>设置你的个人信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
export default {
  data() {
    return {
      avatar: "",
      dialogVisible: false,
    };
  },
  methods: {
    friendsOps() {
      this.$router.push("/addAndDule");
    },
  },
  created() {
    this.avatar = getSessionStorage("user").avatar;
  },
};
</script>

<style lang="scss" scoped>
</style>