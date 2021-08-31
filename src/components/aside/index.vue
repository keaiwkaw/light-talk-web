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
    <div class="aside-bottom mb-10">
      <i class="el-icon-setting text-3xl text-gray-100 cursor-pointer"></i>
    </div>
  </div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
export default {
  data() {
    return {
      avatar: "",
    };
  },
  methods: {
    friendsOps() {
      this.$router.push("/addAndDule");
    },
  },
  created() {
   this.avatar=getSessionStorage("user").avatar 
  },
  
};
</script>

<style lang="scss" scoped>
</style>