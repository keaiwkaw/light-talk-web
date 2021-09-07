<template>
  <div
    class="video-box w-2/12 h-3/6 fixed top-1/2 left-1/2 shadow-lg bg-gray-200 opacity-90"
    draggable="true"
    ref="videoBox"
    v-if="showVideoBox"
  >
    <!-- <p class="text-center pt-3">等待对方接听..</p> -->
    <div
      class="opacity-70 z-30 answerOrReject absolute left-1/2 bottom-6 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-around"
      v-if="state == 1"
    >
      <div
        @click="answerVideo"
        class="opacity-70 z-30 cursor-pointer w-10 h-10 bg-red-600 rounded-full text-white justify-center items-center flex"
      >
        接听
      </div>
      <div
        @click="rejectReceiveVideo"
        class="opacity-70 z-30 w-10 h-10 bg-red-600 rounded-full text-white justify-center items-center flex cursor-pointer"
      >
        拒绝
      </div>
    </div>
    <div
      @click="cancelSendVideo"
      v-if="state == 0"
      class="z-30 opacity-75 cursor-pointer w-10 h-10 bg-red-600 rounded-full text-white justify-center items-center flex absolute left-1/2 bottom-6 transform -translate-x-1/2 -translate-y-1/2"
    >
      取消
    </div>
    <div
      @click="hangupVideo"
      v-if="state == 2"
      class="opacity-70 z-30 cursor-pointer w-10 h-10 bg-red-600 rounded-full text-white justify-center items-center flex absolute left-1/2 bottom-6 transform -translate-x-1/2 -translate-y-1/2"
    >
      挂断
    </div>
    <div class="video-contant h-full w-full z-0 relative">
      <video
        class="w-full h-full z-0"
        :class="minClass"
        ref="video"
        autoplay
      ></video>
      <el-icon
        @click="changeLocalMin"
        class="el-icon-full-screen absolute right-0 bottom-28 z-40 cursor-pointer text-white hover:text-blue-400"
      ></el-icon>
      <video
        class="absolute right-0 bottom-0"
        :class="minClass"
        ref="videoMy"
        autoplay
      ></video>
    </div>
  </div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
import { mapGetters } from "vuex";
export default {
  sockets: {
    cancelSendVideo(user) {
      const infoTips =
        user.socketId === this.user.socketId
          ? "您取消了发送视频"
          : "对方取消了视频";
      this.$message.info(infoTips);
      this.showVideoBox = false;
      if (this.$refs.video) {
        this.$refs.video.srcObject = null;
      }
      this.$refs.videoMy.srcObject = null;
    },
    hangupVideo(user) {
      const infoTips =
        user.socketId === this.user.socketId
          ? "您挂断了发送视频"
          : "对方挂断了视频";
      this.$message.info(infoTips);
      this.peer.close();
      this.peer = null;
      this.showVideoBox = false;
      this.$refs.video.srcObject = null;
      this.$refs.videoMy.srcObject = null;
    },
    rejectReceiveVideo(user) {
      const infoTips =
        user.socketId === this.user.socketId ? "您拒接了" : "对方拒接了";
      this.$message.info(infoTips);
      this.showVideoBox = false;
      this.$refs.video.srcObject = null;
      this.$refs.videoMy.srcObject = null;
    },
    receiverJoinRoom(data) {
      this.$socket.emit("receiverJoinRoom", data);
    },
    async addIceCandidate(candidate) {
      await this.peer.addIceCandidate(candidate);
    },
    //接听视频
    async answerVideo(user) {
      console.log("我要建立本地视频流");
      const localStream = await this.createLocalVideoStream();
      this.localStream = localStream;
      console.log("localStream:", this.localStream);
      this.$refs.videoMy.srcObject = this.localStream;
      this.peer = new RTCPeerConnection();
      this.initPeerListen();
      this.peer.addStream(this.localStream);
      if (user.socketId == this.user.socketId) {
        //接收方
      } else {
        //发送方
        // 发送方 创建offer
        const offer = await this.peer.createOffer(this.offerOption);
        await this.peer.setLocalDescription(offer);
        console.log("发送方要触发onicecandidate了将候选先发送到服务器");
        this.$socket.emit("receiveOffer", { user: this.user, offer });
      }
      this.state = 2;
    },
    //接收视频邀请
    receiveVideo(sender) {
      this.showVideoBox = true;
      // this.$store.commit("setShowVideoBox",true)
      // console.log(this.$el);
      if (sender.socketId == this.user.socketId) {
        this.state = 0;
      } else {
        this.state = 1;
      }
    },
    async receiveOffer(offer) {
      console.log("我收到了来自发送方的offer：", offer);
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      this.$socket.emit("receiveAnsewer", { answer, user: this.user });
    },
    async receiveAnsewer(answer) {
      console.log("我收到了来自发送方的Answer:", answer);
      await this.peer.setRemoteDescription(answer);
    },
  },
  data() {
    return {
      offerOption: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      },
      peerConfigs: {
        // 本地测试无需打洞 如部署到公网 需填写coturn的配置
        // iceServers: [{
        //   urls: 'turn:xxx:3478',
        //   credential: 'xxx',
        //   username: 'xxx'
        // }],
      },
      showVideoBox: false,
      state: 1, //0取消 1拒绝 接听 2挂断
      peer: null,
      localStream: null,
      localMin: true,
    };
  },
  methods: {
    changeLocalMin() {
      console.log(123);
      this.localMin = !this.localMin;
    },
    //初始化监听
    initPeerListen() {
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("我有两次触发");
          this.$socket.emit("addIceCandidate", {
            candidate: event.candidate,
            user: this.user,
          });
        }
      };
      this.peer.onaddstream = (event) => {
        // 拿到对方的视频流
        this.$refs.video.srcObject = event.stream;
      };
      this.peer.onclose = () => {};
    },
    //创建视频流
    async createLocalVideoStream() {
      const constraints = { audio: true, video: true };
      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      return localStream;
    },
    toSendVideo() {
      //加入双方加入共同房间
      this.$socket.emit("joinRoom", {
        user: this.user,
        receiver: this.receiver,
      });
      this.$socket.emit("toSendVideo", this.user);
    },
    answerVideo() {
      this.$socket.emit("answerVideo", this.user);
    },
    rejectReceiveVideo() {
      this.$socket.emit("rejectReceiveVideo", this.user);
    },
    cancelSendVideo() {
      this.$socket.emit("cancelSendVideo", this.user);
    },
    hangupVideo() {
      this.$socket.emit("hangupVideo", this.user);
    },
  },
  computed: {
    user() {
      return {
        socketId: this.$store.getters.getUserSocketID(
          getSessionStorage("userID")
        ),
        user: getSessionStorage("user"),
        roomId: "abc",
      };
    },
    receiver() {
      let receiver = this.$store.state.curPeople;
      return {
        socketId: this.$store.getters.getUserSocketID(receiver._id),
        user: receiver,
        roomId: "abc",
      };
    },
    minClass() {
      if (this.localMin) {
        return {
          "absolute right-0 bottom-0 w-2/4 z-0 h-2/4 object-cover": true,
        };
      } else {
        return {
          "w-full h-full z-0 object-cover": true,
        };
      }
    },
  },
  watch: {
    localMin(newValue, oldValue) {
      console.log(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box {
  transform: translate(-50%, -50%);
}
</style>
