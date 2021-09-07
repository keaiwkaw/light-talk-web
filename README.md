1. AB 创建本地媒体流 （假设 A 是发送方，B 是接收方，客户端简称为 C 端，服务端简称为 S）
2. AB peer = new RTCPeerConnection
3. 监听 peer 的事件
   1. onicecandidate 如果本地代理 SDP Offer 并调用后，将 candidate 发送给对方
   2. onaddstream 如果有视频流就拿到视频流
4. 将本地视频流添加到 peer 中
5. A 创建 offerA 并加入到 peerA 里
6. AC setLocalDescription 后会触发 onicecandidate
7. AC 触发 onicecandidate S 就会收到来自 AC 的 candidate
8. S 将 AC 的 candidate 转发到 BC, BC 将 candidate 存入到 peerB 中
9. AC 将 OfferA 发送给 BC
10. BC 接收到 offerA 后，将 offerA 存入到 peerB 中
    **上面的过程后 AB 将会建立好连接，然后 A B 监听的 onaddstream 事件就会有 stream 流入**
