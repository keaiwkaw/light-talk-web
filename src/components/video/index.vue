<template>
  <div
    class="video-box bg-no-repeat bg-cover object-cover fixed top-1/2 left-1/2 shadow-lg bg-gray-200 opacity-90 overflow-hidden"
    :class="minimizeObj"
    draggable="true"
    ref="videoBox"
    :style="showUrl"
    v-if="showVideoBox"
  >
    <!-- 最小化按钮 -->
    <svg
      @click="minimize"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 absolute top-1 z-50 right-0 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
    <p
      v-if="readyState"
      class="w-full flex justify-center items-center absolute top-1 z-30"
      :class="{ hidden: minimizeObjBool }"
    >
      {{ msg }}
    </p>
    <div class="button" :class="{ hidden: minimizeObjBool }">
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
    </div>
    <div
      class="video-contant h-full w-full z-20 relative"
      :class="{ hidden: minimizeObjBool }"
    >
      <video :class="maxClass" ref="video" autoplay></video>
      <svg
        @click="changeLocalMin"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 el-icon-full-screen absolute right-0 bottom-28 z-40 cursor-pointer text-white hover:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-if="state == 2 && this.boo"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
      <video :class="minClass" ref="videoMy" autoplay></video>
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
      if (this.localStream.getTracks()[0]) {
        this.localStream.getTracks()[0].stop();
      }
      if (this.localStream.getTracks()[1]) {
        this.localStream.getTracks()[1].stop();
      }
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
      if (this.localStream.getTracks()[0]) {
        this.localStream.getTracks()[0].stop();
      }
      if (this.localStream.getTracks()[1]) {
        this.localStream.getTracks()[1].stop();
      }

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
      if (this.localStream.getTracks()[0]) {
        this.localStream.getTracks()[0].stop();
      }
      if (this.localStream.getTracks()[1]) {
        this.localStream.getTracks()[1].stop();
      }
    },
    async addIceCandidate(candidate) {
      await this.peer.addIceCandidate(candidate);
    },
    //接听视频
    async answerVideo(user) {
      this.initVideoBoxEvent();
      console.log("我要建立本地视频流");
      const localStream = await this.createLocalVideoStream();
      this.localStream = localStream;
      console.log("localStream:", this.localStream);
      this.$refs.videoMy.srcObject = this.localStream;
      this.peer = new RTCPeerConnection();
      console.log("创建的Peer", this.peer);
      this.initPeerListen();
      this.peer.addStream(this.localStream);
      if (user.socketId == this.user.socketId) {
        //接收方
      } else {
        //发送方
        // 发送方 创建offer
        const offer = await this.peer.createOffer(this.offerOption);
        await this.peer.setLocalDescription(offer);
        console.log("发送方要触发onicecandidate了,将候选先发送到服务器");
        this.$socket.emit("receiveOffer", { user: this.user, offer });
      }
      this.state = 2;
      this.readyState = false; //让上面的提示文字信息消失
    },
    //接收视频邀请
    receiveVideo(data) {
      const { user: sender, receiver, boo } = data;
      console.log("收到了视频的邀请");
      this.boo = boo;
      this.roomId = sender.roomId;
      if (sender.socketId == this.user.socketId) {
        this.bgUrl = receiver.user.avatar;
        this.state = 0; //发送方
      } else {
        this.bgUrl = sender.user.avatar;
        this.msg = "收到" + sender.user.nickname + "的来电";
        this.state = 1; //接收方
      }
      this.showVideoBox = true;
    },
    async receiveOffer(offer) {
      console.log("我收到了来自发送方的offer：", offer);
      console.log("我自己的Peer", this.peer);
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      this.$socket.emit("receiveAnswer", { answer, user: this.user });
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
      localStream: null, //本地媒体流
      localMin: false, //是否应该小框展示
      bgUrl: "",
      msg: "等待对方接听",
      roomId: "", // 双方的roomId
      readyState: true,
      boo: true,
      minimizeObjBool: false,
    };
  },
  methods: {
    changeLocalMin() {
      console.log("我要改变localMin");
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
    initVideoBoxEvent() {
      let box = this.$refs.videoBox;
      box.addEventListener("dragend", function (e) {
        // e.stopPropagation();
        box.style.top = event.clientY + "px";
        box.style.left = event.clientX + "px";
      });
    },
    //创建视频流
    async createLocalVideoStream() {
      console.log(this.boo);
      const constraints = { audio: true, video: this.boo };

      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      return localStream;
    },
    toSendVideo(boo) {
      if (this.showVideoBox) {
        this.$message.error("请先结束本次通话!");
        return;
      }
      this.roomId = this.$uuid();
      this.user.roomId = this.receiver.roomId = this.roomId;

      //加入双方加入共同房间
      this.$socket.emit("joinRoom", {
        user: this.user,
        receiver: this.receiver,
        boo,
      });
    },
    answerVideo() {
      console.log("点击了接听按钮");
      this.$socket.emit("answerVideo", this.user);
    },
    rejectReceiveVideo() {
      this.$socket.emit("rejectReceiveVideo", this.user);
    },
    cancelSendVideo() {
      this.$socket.emit("cancelSendVideo", this.user);
    },
    hangupVideo() {
      console.log("挂断视频电话");
      this.$socket.emit("hangupVideo", this.user);
    },
    minimize() {
      this.minimizeObjBool = !this.minimizeObjBool;
    },
  },
  computed: {
    // 当前用户
    user() {
      return {
        socketId: this.$store.getters.getUserSocketID(
          getSessionStorage("userID")
        ),
        user: getSessionStorage("user"),
        roomId: this.roomId,
      };
    },
    //要接收消息的用户
    receiver() {
      let receiver = this.$store.state.curPeople;
      return {
        socketId: this.$store.getters.getUserSocketID(receiver._id),
        user: receiver,
        roomId: this.roomId,
      };
    },
    //动态生成video放大缩小样式
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
    maxClass() {
      if (this.localMin) {
        return {
          "w-full h-full z-0 object-cover": true,
        };
      } else {
        return {
          "absolute right-0 bottom-0 w-2/4 z-0 h-2/4 object-cover": true,
        };
      }
    },
    showUrl() {
      return {
        "background-image": `url(${this.bgUrl})`,
      };
    },
    minimizeObj() {
      if (this.minimizeObjBool) {
        return {
          "w-1/12": true,
          "h-16": true,
          "bg-white": true,
        };
      } else {
        return {
          "w-2/12 h-3/6": true,
        };
      }
    },
  },
  watch: {
    localMin(newValue, oldValue) {
      console.log(newValue);
    },
    showVideoBox(newValue, oldValue) {
      if (!newValue) {
        this.msg = "等待对方接听";
        this.readyState = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box {
  transform: translate(-50%, -50%);
  background-image: url();
}
</style>
