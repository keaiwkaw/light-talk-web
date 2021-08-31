<template>
  <div class="a">
    <el-button @click="open">连接socket</el-button>
  </div>
</template>

<script>
export default {
  sockets:{
    chat(){
      console.log();
    }
  },
  data() {
    return {
      select: 1,
      input: "234234",
    };
  },
  methods: {
    open() {
      this.$socket.open();
      this.$socket.on("chat");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select .el-input {
  width: 230px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.a {
  width: 480px;
}
</style>