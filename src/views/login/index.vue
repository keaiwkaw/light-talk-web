<template>
  <div
    class="login-box flex justify-center items-center border-black-600 h-80 shadow-gray-900"
  >
    <div class="w-1/2 h-3/4 pl-6 bg-gray-50 flex pt-10 flex-col shadow-md">
      <h1 class="text-2xl font-semibold mb-14">登录/注册</h1>
      <p class="text-base font-thin pb-2">
        欢迎光临，请输入您的用户名和密码登录！
        <span class="text-sm">未注册过的账号将会直接注册</span>
      </p>
    </div>
    <div
      class="flex-1 bg-opacity-95 h-80 flex justify-center items-center bg-primary shadow-md"
    >
      <el-form
        :model="loginForm"
        class="w-3/4"
        label-position="left"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item
          label="邮箱"
          class="flex justify-center flex-col w-full"
          prop="email"
        >
          <el-input v-model="loginForm.email" type="text"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          class="flex justify-center flex-col w-full"
          prop="password"
        >
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <button
            class="text-gray-50 text-xl font-thin w-full h-10"
            @click.prevent="submit"
          >
            登录
          </button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/service/getData";
import { setSessionStorage } from "@/utils/localOps";
let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export default {
  data() {
    let checkemail = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error("请输入正确邮箱"));
      }
    };
    return {
      loginForm: {
        email: "2@qq.com",
        password: "123456",
      },
      rules: {
        email: [{ validator: checkemail, trigger: "blur" }],
        password: [
          { required: true, message: "请输入正确的密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async submit() {
      let self = this;
      let email = this.loginForm.email,
        password = this.loginForm.password;
      if (
        reg.test(this.loginForm.email) &&
        password.length > 5 &&
        password.length < 20
      ) {
        let res = await login(this.loginForm);
        if (res.code !== 200) {
          this.$message({
            type: "error",
            message: "密码错误",
          });
        } else {
          this.$message({
            type: "success",
            message: "登录成功",
          });
          setSessionStorage("userID", res.id);
          this.$store.commit("setUser", res.user);
          setSessionStorage("token", res.token);
          this.$router.push("/");
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入正确的邮箱或密码",
        });
      }
    },
  },
};
</script>

<style scoped>
</style>