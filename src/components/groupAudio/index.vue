<template>
  <div class="audio-group">
    <div
      class="overflow-scroll groupAudio fixed top-1/2 left-1/2 flex max-h-64 max-w-lg flex-wrap transform -translate-x-1/2 -translate-y-1/2"
      v-if="showGroupAudio"
      draggable="true"
      :class="minimizeObj"
      ref="slidBox"
    >
      <!-- 关闭群聊 -->
      <svg
        @click="closeGroupVideo"
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
      <!-- 放大或者缩小 -->
      <svg
        @click="minimize"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 absolute top-1 z-50 left-0 cursor-pointer"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          stroke="#374151"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8V4m0 0h4M3 4l4 4m8 0V4m0 0h-4m4 0l-4 4m-8 4v4m0 0h4m-4 0l4-4m8 4l-4-4m4 4v-4m0 4h-4"
        />
      </svg>
      <!-- 视频区-item -->
      <div ref="videoBox" :class="{ hidden: minimizeObjBool }" class="flex">
        <!-- <video autoplay class="w-32 h-32 border-2 border-blue-500"></video> -->
      </div>
    </div>
    <!-- 加入时的dialog -->
    <div class="joinAudio">
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>你要加入群音视频吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="joinAudio">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, //展示对话框
      showGroupAudio: false, //展示video
      groupHasAudio: false, //群中是否有人打电话了
      peer: null,
      localStream: null,
      boo: true,
      videoList: [],
      offerOption: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      },
      minimizeObjBool: false,
      peerList: [],
    };
  },
  sockets: {
    async receiveOfferGroup(offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        this.$socket.emit("receiveAnswerGroup", {
          answer,
          group: this.$store.state.curPeople,
          user: this.user,
        });
      }
    },
    async receiveAnswerGroup(answer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(answer);
      }
    },
    async answerVideoGroup(data) {
      this.groupHasAudio = true;
      this.$bus.$emit("groupHasAudio", this.groupHasAudio);
    },
    async addIceCandidateGroup(candidate) {
      if (this.peer) {
        await this.peer.addIceCandidate(candidate);
      }
    },
    updatePeerList(peerList) {
      this.peerList = peerList;
    },
  },
  methods: {
    //群友确认加入时的逻辑
    joinAudio() {
      //加入逻辑
      this.answerVideoGroup();
      this.dialogVisible = false;
      this.showGroupAudio = true;
    },
    //第一个人发起群视频
    async answerVideoGroup() {
      //展开的的点击加入框
      //创建自己的localStream

      this.localStream = await this.createLocalVideoStream();
      this.videoList.push(this.localStream);
      this.showGroupAudio = true;

      this.createVideo(this.localStream, this.user);
      console.log(this.localStream);
      this.initVideoBoxEvent();
      this.peer = new RTCPeerConnection();
      this.$socket.emit("updatePeerList", {
        peer: this.peer,
        user: this.user,
        group: this.$store.state.curPeople,
      });
      //找到当前的
      console.log("peerList是：",this.peerList);
      console.log("当前的peer是",this.peer);
      let user = null;
      for (let i = 0; i < this.peerList.length; i++) {
        if (this.peerList[i].peer == this.peer) {
          user = this.peerList[i].user;
          break;
        }
      }
      console.log("找到的user是", user);
      this.initPeerEvent(user);
      //  console.log(this.peer);
      await this.peer.addStream(this.localStream);
      //发送自己的offer
      const offer = await this.peer.createOffer(this.offerOption);
      await this.peer.setLocalDescription(offer);
      this.$socket.emit("receiveOfferGroup", {
        group: this.$store.state.curPeople,
        user: this.user,
        offer: offer,
      });
      //通知别人
      this.$socket.emit("answerVideoGroup", {
        group: this.$store.state.curPeople,
        user: this.user,
      });
    },
    //创建stream
    async createLocalVideoStream() {
      const constraints = { audio: true, video: this.boo };
      let localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return localStream;
    },

    initPeerEvent(user) {
      this.peer.onicecandidate = (e) => {
        if (e.candidate) {
          //向所有在线的用户发送ice代理
          this.$socket.emit("addIceCandidateGroup", {
            group: this.$store.state.curPeople,
            user: this.user,
            candidate: e.candidate,
          });
        }
      };
      this.peer.onaddstream = (e) => {
        console.log("当触发加入事件时", e);
        this.createVideo(e.stream, user);
      };
    },
    openAudioView() {
      this.dialogVisible = true;
    },
    //创建video
    createVideo(stream, user) {
      // console.log(stream);
      const videoBox = this.$refs.videoBox;
      let video = document.createElement("video");
      video.className = "w-32 h-32 border-2 border-blue-500 object-cover";
      if (user) {
        video.id = user._id;
      }
      video.autoplay = true;
      videoBox.appendChild(video);
      video.srcObject = stream;
    },
    //关闭群聊
    closeGroupVideo() {
      this.$socket.emit("hungupVideo");
      this.peer = null;
      const videoBox = this.$refs.videoBox;
      const videos = videoBox.querySelectorAll("video");
      console.log(videos);
      let count = videos.length;
      for (let i = 0; i < videos.length; i++) {
        videoBox.removeChild(videos[i]);
      }
      // 关闭之后应当向服务器发送一个关闭的通知
      console.log(count);
      if (count > 1) {
        this.groupHasAudio = true;
        this.$bus.$emit("groupHasAudio", this.groupHasAudio);
      } else {
        this.groupHasAudio = false;
        this.$bus.$emit("groupHasAudio", this.groupHasAudio);
      }
      this.showGroupAudio = false;
    },
    minimize() {
      this.minimizeObjBool = !this.minimizeObjBool;
    },
    initVideoBoxEvent() {
      let box = this.$refs.slidBox;
      box.addEventListener("dragend", function (e) {
        // e.stopPropagation();
        box.style.top = event.clientY + "px";
        box.style.left = event.clientX + "px";
      });
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    minimizeObj() {
      if (this.minimizeObjBool) {
        return {
          "w-1/12": true,
          "h-16": true,
          "bg-white": true,
        };
      }
    },
  },
  watch: {
    showGroupAudio(newValue, oldValue) {
      if (newValue) {
        this.groupHasAudio = false;
        this.$bus.$emit("groupHasAudio", this.groupHasAudio);
      } else {
        this.groupHasAudio = true;
        this.$bus.$emit("groupHasAudio", this.groupHasAudio);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
</style>