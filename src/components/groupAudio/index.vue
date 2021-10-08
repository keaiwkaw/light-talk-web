<template>
  <div class="audio-group">
    <div
      class="overflow-scroll groupAudio fixed top-1/2 left-1/2 flex max-h-64 max-w-lg flex-wrap transform -translate-x-1/2 -translate-y-1/2"
      v-if="true"
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
      localStream: null,
      boo: true,
      offerOption: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      },
      minimizeObjBool: false,
      pc: null,
      groupUserList: [],
      userPeerList: {},
      isCreateOffer: false,
      id: null,
    };
  },
  sockets: {
    async receiveOfferGroup(data) {
      let peerName = data.user._id;
      if (this.userPeerList[peerName]) {
        await this.userPeerList[peerName].setRemoteDescription(data.offer);
        let answer = await this.userPeerList[peerName].createAnswer();
        await this.userPeerList[peerName].setLocalDescription(answer);
        this.$socket.emit("receiveAnswerGroup", {
          group: this.$store.state.curPeople,
          answer,
          user: data.user,
        });
      }
    },
    async receiveAnswerGroup(data) {
      let peerName = data.user._id;
      if (this.userPeerList[peerName]) {
        await this.userPeerList[peerName].setRemoteDescription(data.answer);
      }
    },
    async answerVideoGroup() {
      this.groupUserList = this.$store.state.curPeople.groupMembers.map(
        (i) => i.user
      );
      this.localStream = await this.createLocalVideoStream();
      console.log("收到邀请创建localStream", this.localStream);
      await this.initPeerList();
      await this.onCreateOffer(); //给除过自己的所有群友setLocalDescription
      this.$bus.$emit("groupHasAudio", true);
    },
    async addIceCandidateGroup(data) {
      let peerName = data.user._id;
      if (this.userPeerList[peerName]) {
        await this.userPeerList[peerName].addIceCandidate(data.candidate);
      }
    },
  },
  methods: {
    closeGroupVideo() {
      if (this.localStream.getTracks()[0]) {
        this.localStream.getTracks()[0].stop();
      }
      if (this.localStream.getTracks()[1]) {
        this.localStream.getTracks()[1].stop();
      }
      const videoBox = this.$refs.videoBox;
      videoBox.removeChild(document.getElementById(this.user._id));
    },
    //群友确认加入时的逻辑
    async joinAudio() {
      //加入逻辑
      this.showGroupAudio = true;
      this.dialogVisible = false;
      await this.answerVideoGroup(); //通知所有客户端获取群中人员列表
      setTimeout(async () => {
        console.log("localStream", this.localStream);
        await this.initVideoStream(); //初始化本地的视频流
      }, 2000);

      // await this.initPeerList(); // 给除过自己的所有群友初始化 pc
      // await this.onCreateOffer(); //给除过自己的所有群友setLocalDescription
    },
    answerVideoGroup() {
      this.$socket.emit("answerVideoGroup", {
        group: this.$store.state.curPeople,
      });
    },
    //创建stream
    async createLocalVideoStream() {
      const constraints = { audio: true, video: this.boo };
      let localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return localStream;
    },

    //弹出是否加入群聊对话框
    openAudioView() {
      this.dialogVisible = true;
    },
    //创建video
    createVideo(stream, user) {
      // console.log(stream);
      const videoBox = this.$refs.videoBox;
      let video = document.createElement("video");
      video.className = "w-32 h-32 border-2 border-blue-500 object-cover";

      video.id = user._id;

      video.autoplay = true;
      videoBox.appendChild(video);
      video.srcObject = stream;
    },
    //关闭群聊
    minimize() {
      this.minimizeObjBool = !this.minimizeObjBool;
    },
    //初始化拖动事件
    initVideoBoxEvent() {
      let box = this.$refs.slidBox;
      box.addEventListener("dragend", function (e) {
        // e.stopPropagation();
        box.style.top = event.clientY + "px";
        box.style.left = event.clientX + "px";
      });
    },
    //创建本地视频流并赋值给
    async initVideoStream() {
      this.createVideo(this.localStream, this.user);
    },
    async initPeerList() {
      this.userPeerList = [];
      for (let user of this.groupUserList) {
        // 给除过自己的所有群友初始化 pc‘

        if (user._id != this.user._id) {
          let peerName = user._id;
          console.log(user);
          this.initPeer(peerName, user);
        }
      }
    },
    initPeer(peerName, user) {
      let pc = new RTCPeerConnection();
      let that = this;
      pc.addStream(that.localStream);
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          that.$socket.emit("addIceCandidateGroup", {
            candidate: event.candidate,
            group: that.$store.state.curPeople,
            user,
          });
        }
      };
      pc.onaddstream = (event) => {
        that.createVideo(event.stream, user);
      };
      that.userPeerList[peerName] = pc;
    },
    async onCreateOffer() {
      let that = this;
      for (const user of that.groupUserList) {
        if (that.user._id != user._id) {
          const peerName = user._id;
          let offer = await that.userPeerList[peerName].createOffer(
            that.offerOption
          );
          await that.userPeerList[peerName].setLocalDescription(offer);
          that.$socket.emit("receiveOfferGroup", {
            offer,
            user,
            group: that.$store.state.curPeople,
          });
        }
      }
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
};
</script>

<style lang="sass" scoped>
</style>