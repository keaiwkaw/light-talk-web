/* 
设置 session
*/

export const setSessionStorage = (name, val) => {
  if (typeof val !== "string") {
    val = JSON.stringify(val);
  }
  sessionStorage.setItem(name, val);
};
/* 
获取 session
*/
export const getSessionStorage = (name) => {
  let res = window.sessionStorage.getItem(name);
  if (!res) {
    return "";
  }
  try {
    return JSON.parse(res);
  } catch (error) {
    return res;
  }
};
/* 
设置local
*/
export const setLocalStorage = (name, val) => {
  if (typeof val !== "string") {
    val = JSON.stringify(val);
  }
  let _id = getSessionStorage("userID");
  window.localStorage.setItem(name + "-" + _id, val);
};

/* 
获取 local
*/
export const getLocalStorage = (name) => {
  let _id = getSessionStorage("userID");
  let res = window.localStorage.getItem(name + "-" + _id);

  if (!res) {
    return "";
  }
  try {
    return JSON.parse(res);
  } catch (error) {
    return res;
  }
};
/* 
/*  

    设置正在会话的列表 
   chatingPeople [{},{}]
*/
export const setChatingPeople = (people) => {
  setLocalStorage("chatingPeople", people);
};
/* 
  获取会话列表
*/
export const getChatingPeople = () => {
  return getLocalStorage("chatingPeople");
};
