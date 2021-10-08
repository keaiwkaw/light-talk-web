<template>
  <div
    class="chat-cop flex-1 flex flex-col h-full ml-2 justify-between"
    v-if="this.$route.params.id"
  >
    <h1 class="text-2xl font-medium">
      {{ $store.state.curPeople ? $store.state.curPeople.nickname : "" }}
    </h1>
    <div
      @click="openAudioView"
      class="joinAudio h-10 text-base w-3/4 flex justify-center items-center cursor-pointer flex-1"
      v-if="groupHasAudio"
    >
      点击加入群音视频 >
    </div>
    <!-- message-box -->
    <friend-chat
      v-if="!$store.state.curPeople.requestList"
      ref="hideScrollBar"
    />
    <group-chat v-else ref="hideScrollBar" />

    <!-- message-box-end -->

    <!-- control-begin -->
    <div class="control-box h-1/4 flex flex-col">
      <div class="util flex h-10 relative">
        <VEmojiPicker
          @select="selectEmoji"
          v-show="showEmojipicker"
          emojiSize="25"
          emojisByRow="5"
          class="absolute bottom-10"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-5 text-gray-500 cursor-pointer hover:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click="showEmojipicker = !showEmojipicker"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-5 text-gray-500 cursor-pointer hover:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-5 text-gray-500 cursor-pointer hover:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click="toSendAudio"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-5 text-gray-500 cursor-pointer hover:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click="toSendVideo"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div class="send-box h-full flex flex-col items-end relative">
        <textarea
          name=""
          id=""
          class="w-full h-4/6"
          v-model="message"
          @keydown.enter="sendMessage"
          ref="sendArea"
        ></textarea>
        <button
          type="button"
          class="w-20 bg-primary h-10 text-gray-50 absolute bottom-0"
          @click="sendMessage"
        >
          发送
        </button>
      </div>
    </div>
  </div>

  <!-- 未在和任何人聊天时显示 -->
  <div
    v-else
    class="flex justify-center items-center flex-1 flex-col h-full ml-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-20 w-20 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
      />
    </svg>
  </div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
import { mapState } from "vuex";
import friendChat from "./friendChat";
import groupChat from "./groupChat";
import videoComp from "@/components/video";

export default {
  components: {
    friendChat,
    groupChat,
    videoComp,
  },
  sockets: {
    receive(data) {
      if (data.group) {
        console.log("收到群消息", data);
      } else {
        console.log("收到好友消息", data);
      }

      this.$store.commit("addSingleMessage", {
        people: data.user,
        user: data.user,
        group: data.group,
        message: data.message,
        route: data.group ? data.group._id : data.user._id, //如果有group 代表他是一个群
      });
      this.$store.commit("setChatingCount", data);
    },
  },
  data() {
    return {
      userID: getSessionStorage("userID"),
      message: "",
      messageCollect: [],
      showVideoBox: false,
      showGroupAudio: true,
      groupHasAudio: false,
      showEmojipicker: false,
    };
  },
  methods: {
    //发送消息
    sendMessage() {
      let curPeopleId = this.$route.params.id;
      let socketId = this.$store.getters.getUserSocketID(curPeopleId);
      let curPeople = this.$store.state.curPeople;
      if (!curPeople.requestList) {
        if (!socketId) {
          this.$message.error("对方不在线哦！");
          return;
        } else {
          this.$socket.emit("sendMessage", {
            user: this.user,
            message: this.message,
            socketID: socketId,
          });
        }
      } else {
        console.log("群消息要发送了");
        this.$socket.emit("sendMessageByGroup", {
          user: this.user,
          message: this.message,
          group: curPeople,
        });
      }

      this.$store.commit("clearChatingCount", { _id: curPeopleId });
      //将信息加入到信息队列中去
      this.$store.commit("addSingleMessage", {
        user: this.user,
        message: this.message,
        route: curPeopleId,
        people: this.curPeople,
      });
      // this.$store.commit("addChating", this.curPeople);
      //滚动条滚到最底部
      this.message = "";
      this.$refs.sendArea.focus();
      this.showEmojipicker = false;
    },
    //视频聊天
    toSendVideo() {
      if (!this.$store.state.curPeople.requestList) {
        //如果是好友视频通话
        this.$emit("toSendVideo", true);
      } else {
        //如果是群视频
        this.$emit("openAudioView", true);
      }
    },
    toSendAudio(boo) {
      this.$emit("toSendVideo", false);
    },
    //打开群音视频窗口
    openAudioView() {
      this.$emit("openAudioView");
    },
    selectEmoji(emoji) {
      let sendArea = this.$refs.sendArea;
      let start = sendArea.selectionStart;
      let end = sendArea.selectionEnd;
      if (start == undefined || end == undefined) return;
      let val = sendArea.value;
      let result = val.substring(0, start) + emoji.data + val.substring(end);
      sendArea.value = result;
      sendArea.focus();
      sendArea.selectionStart = start + emoji.data.length;
      sendArea.selectionEnd = start + emoji.data.length;
      this.message = result;
    },
  },
  mounted() {
    //将聊天窗口滚动条滚到最底部
  },
  created() {
    this.$bus.$on("groupHasAudio", (msg) => {
      this.groupHasAudio = msg;
    });
  },

  computed: {
    ...mapState(["curPeople", "chating", "historyChat", "user"]),
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  display: none;
}
textarea {
  background: none !important;
  outline: none;
}
</style>
