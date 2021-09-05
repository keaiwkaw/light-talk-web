<template>
  <div></div>
</template>

<script>
import { getSessionStorage } from "@/utils/localOps";
export default {
  sockets: {
    //取消发送视频
    cancelSendVideo(user) {
      const infoTips =
        user.socketID == socketID ? "您取消了发送视频" : "对方取消了发送视频";
      this.$message.info(infoTips);
      VIDEO_VIEW.hideAllVideoModal();
    },
    //接受视频邀请
    receiveVideo(sender) {
      if (sender.socketID == this.socketID) return false;
      l;
      VIDEO_VIEW.showDevicesNameByDevices(sender);
    },
    //拒绝接受视频
    rejectReceiveVideo(user) {
      const infoTips =
        user.socketID === this.socketID
          ? "您拒绝了接收视频"
          : "对方拒绝了接收视频";
      this.$message.info(infoTips);
      VIDEO_VIEW.hideAllVideoModal();
    },
    //接听视频
    answerVideo(user) {
      VIDEO_VIEW.showInvideoModal();
      //创建本地信息
      const localStream = await this.createLocalVideoStream();
      this.localStream = localStream
       document.querySelector('#echat-local').srcObject = this.localStream;
       this.peer = new RTCPeerConnection()
       this.initPeerListen();
       this.peer.addStream(this.localStream);
       if(user.socketID==this.socketID){
         //接收方
       }else{
         const offer = await this.peer.createOffer(this.offerOption);
         await this.peer.setLocalDescription(offer);
         this.$socket.emit('receiveOffer',{user:this.user,offer})
       }
    },
    hangupVideo(user){
       const infoTips = user.sockID === this.sockID ? '您挂断了视频' : '对方挂断了视频';
        this.$message.info(infoTips);
        this.peer.close();
        this.peer = null;
        VIDEO_VIEW.hideAllVideoModal();
        document.querySelector('#echat-remote-1').srcObject = null;
        document.querySelector('#echat-local').srcObject = null;
    },
   async addIceCandidate(candidate){
      await this.peer.addIceCandidate(candidate);
    },
    async  receiveOffer(offer){
         await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
       this.$socket.emit('receiveAnsewer', { answer, user: this.user });
    },
    receiveAnsewer(answer){
    this.peer.setRemoteDescription(answer);
    }
  },
  data() {
    return {
      canSupportVideo: false,
      socketID: this.$store.getters.getUserSocketID(
        getSessionStorage("userID")
      ),
      localStream:null,
      peer:null
    };
  },
  created() {},
  methods: {
    canSupportWebRTC() {
      if (typeof navigator.mediaDevices !== "object") {
        this.$message.error("没有媒体设备哦！");
        return false;
      }
      if (typeof navigator.mediaDevices.enumerateDevices !== "function") {
        this.$message.error("没有设备列表");
        return false;
      }
      if (typeof navigator.mediaDevices.getUserMedia !== "function") {
        this.$message.error("获取不到设备信息");
        return false;
      }
      this.canSupportVideo = true;
      this.getDevices();
      return true;
    },
    async getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        VIDEO_VIEW.showDevicesNameByDevices(devices);
      } catch (error) {
        this.$message.error("获取设备出错");
      }
    },
   async createLocalVideoStream(){
      const constraints = { audio: true, video: true };
      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      console.log("localStream:", localStream);
      return localStream;
    },
    initPeerListen(){
        this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("addIceCandidate", {
            candidate: event.candidate,
            user: this.user,
          });
        }
      };
      this.peer.onaddstream = (event) => {
        // 拿到对方的视频流
        document.querySelector("#echat-remote-1").srcObject = event.stream;
      };
      this.peer.onclose = () => {};
    }
  },
   initVIDEO_VIEWSdk() {
      const configOptios = {
        startVideoCancelCb: this.startVideoCancelCb,
        receiveVideoCancelCb: this.receiveVideoCancelCb,
        receiveVideoAnswerCb: this.receiveVideoAnswerCb,
        hangUpVideoCb: this.hangUpVideoCb,
        openMikeCb: this.openMikeCb,
        closeMikeCb: this.closeMikeCb,
        openCammerCb: this.openCammerCb,
        closeCammerCb: this.closeCammerCb,
        toScreenCb: this.toScreenCb,
      };
      VIDEO_VIEW.configCallBack(configOptios);
    },
        startVideoCancelCb() {
      socket.emit("cancelSendVideo", this.user);
      VIDEO_VIEW.hideAllVideoModal();
    },
    receiveVideoCancelCb() {
      socket.emit("rejectReceiveVideo", this.user);
      VIDEO_VIEW.hideAllVideoModal();
    },
    receiveVideoAnswerCb() {
      socket.emit("answerVideo", this.user);
    },
    hangUpVideoCb() {
      socket.emit("hangupVideo", this.user);
    },
    openMikeCb() {},
    closeMikeCb() {},
    openCammerCb() {},
    closeCammerCb() {},
    toScreenCb() {},
};
</script>

<style lang="scss" scoped>
</style>