import fetch from "../utils/fetch";

/* 
  登录
*/
export const login = (data) =>
  fetch(
    "/login",
    {
      email: data.email,
      password: data.password,
    },
    "POST"
  );
/* 
  发送好友请求
*/
export const sendRequestAdd = (data) =>
  fetch(
    "/sendRequestAdd",
    {
      selfID: data.selfID,
      otherID: data.otherID,
      message: data.message,
    },
    "POST"
  );

/* 
    处理好友请求 同意code=1或者拒绝 code = 2
*/
export const dealRequestAdd = (data) =>
  fetch(
    "/dealRequestAdd",
    {
      code: data.code,
      selfID: data.selfID,
      otherID: data.otherID,
    },
    "POST"
  );

/* 
    删除好友
   */
export const deleteFriends = (data) =>
  fetch(
    "/deleteFriends",
    {
      selfID: data.selfID,
      otherID: data.otherID,
    },
    "POST"
  );
/* 
    获取好友列表 返回 friends:Array
*/
export const getFriends = (data) =>
  fetch(
    "/getFriends",
    {
      selfID: data.selfID,
    },
    "POST"
  );

/* 
  获取对应的请求列表  返回 list
    type passing/pass/unpass state 
    state friends/groups
*/
export const getRequestList = (data) =>
  fetch(
    "/getRequestList",
    {
      selfID: data.selfID,
      type: data.type,
      state: data.state,
    },
    "POST"
  );
/* 
  查询好友 type user/group
*/
export const searchPeopleToType = (data) =>
  fetch(
    "/searchPeopleToType",
    {
      type: data.type,
      value: data.value,
      selfID: data.selfID,
    },
    "POST"
  );

/* 
  创建群聊
  */
export const createGroup = (data) =>
  fetch(
    "/createGroup",
    {
      form: data.form,
      selfID: data.selfID,
    },
    "POST"
  );

/* 
获取群聊列表
*/
export const getGroups = (data) =>
  fetch("/getGroups", {
    selfID: data.selfID,
  });

/* 
  根据输入的类容和类型来获取结果
  */
export const searchGroupToType = (data) =>
  fetch("/searchGroupToType", {
    type: "group",
    value: data.value,
    selfID: data.selfID,
  });
/* 
发送添加群的请求
*/
export const sendRequestAddGroup = (data) =>
  fetch(
    "/sendRequestAddGroup",
    {
      selfID: data.selfID,
      groupID: data.groupID,
      message: data.message,
    },
    "POST"
  );

/* 
  处理加群的请求
  */
export const dealRequestAddGroup = (data) =>
  fetch(
    "/dealRequestAddGroup",
    {
      code: data.code,
      groupID: data.groupID,
      userID: data.userID,
    },
    "POST"
  );
/* 
获取请求列表
*/
export const getRequestListGroup = (data) =>
  fetch("/getRequestListGroup", {
    selfID: data.selfID,
    type: data.type,
  });
