<template>
  <div class="group-item">
    <el-button @click="showCreateGroup = true" class="m-2 w-full"
      >创建群</el-button
    >
    <div class="management">
      <p class="text-lg font-semibold ml-1">我管理的群</p>
      <ul>
        <li
          v-for="item in management"
          :key="item._id"
          class="flex items-center my-2"
        >
          <img
            :src="item.group.avatar"
            alt=""
            class="w-12 h-12 rounded-full mr-3 ml-2"
          />
          <div class="inf-box mr-1 flex-1">
            <div class="flex justify-between">
              <p class="nowrap-hidden w-3/5">{{ item.group.nickname }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="join">
      <p class="text-lg font-semibold ml-1">我加入的群</p>
      <ul>
        <li
          v-for="item in management"
          :key="item._id"
          class="flex items-center"
        >
          <img
            :src="item.group.avatar"
            alt=""
            class="w-12 h-12 rounded-full mr-3 ml-2"
          />
          <div class="inf-box mr-1 flex-1">
            <div class="flex justify-between">
              <p class="nowrap-hidden w-3/5">{{ item.group.nickname }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 创建群的dialog -->
    <el-dialog title="创建群" :visible.sync="showCreateGroup" width="30%">
      <el-form :model="groupModel">
        <el-form-item label="群名称 :">
          <el-input v-model="groupModel.nickname"></el-input>
        </el-form-item>
        <el-form-item label="群头像 :">
          <div
            class="updateAvatar flex items-center justify-around h-full w-full"
          >
            <el-avatar
              icon="el-icon-user-solid"
              :src="groupModel.avatar"
              class="w-16 h-16 flex justify-center items-center rounded-full"
            ></el-avatar>
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="
                (res) => {
                  $set(groupModel, 'avatar', res.url);
                }
              "
            >
              <img v-if="true" src="" class="avatar" />
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="群公告 :">
          <el-input v-model="groupModel.groupOfPublic"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCreateGroup = false">取 消</el-button>
        <el-button type="primary" @click="createGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createGroup, getGroups } from "@/service/getData";
import { getSessionStorage } from "@/utils/localOps";
export default {
  data() {
    return {
      management: [],
      join: [],
      showCreateGroup: false,
      groupModel: { nickname: "", avatar: "", groupOfPublic: "" },
      imageUrl: "",
    };
  },
  mounted() {},
  methods: {
    async createGroupSubmit() {
      console.log("我要创建群啦");
      let res = await createGroup({
        selfID: getSessionStorage("userID"),
        form: this.groupModel,
      });
    
      if (res.code == 200) {
        this.getGroups();
        this.$message({
          type: "success",
          message: "创建群聊成功",
        });
        this.showCreateGroup = false;
      }
    },
    async getGroups() {
      let res = await getGroups({
        selfID: getSessionStorage("userID"),
      });
      if (res.code === 200) {
        let groups = res.groups;
        console.log(res);
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].type != 0) {
            this.management.push(groups[i]);
          } else {
            this.join.push(groups[i]);
          }
        }
      }
    },
  },
  created() {
    this.getGroups();
  },
};
</script>

<style  scoped>
.avatar-uploader {
  @apply w-16 h-16 flex justify-center items-center;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.avatar-uploader:hover {
  @apply w-16 h-16 flex justify-center items-center;
  border: 1px solid #409eff;
}
.avatar-uploader-icon {
  @apply h-10 w-10 flex justify-center items-center text-2xl;
}
.el-avatar--circle img {
  @apply w-16 h-16;
  border-radius: 50%;
}
</style>