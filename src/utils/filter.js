export const VueFilter = (Vue) => {
  Vue.filter("dealTime", function(val) {
    if (!val) {
      return "";
    }
    let nowDate = new Date().getDate();
    let old = new Date(val);
    let oldDate = old.getDate();
    let poor = nowDate - oldDate;

    if (nowDate - oldDate < 1) {
      let hours = old.getHours();
      let min = old.getMinutes();
      return (
        String(hours).padStart(2, "0") + ":" + String(min).padStart(2, "0")
      );
    } else if (poor == 1) {
      return "1天前";
    } else if (poor == 2) {
      return "2天前";
    } else if (poor == 3) {
      return "3天前";
    } else {
      let year = old.getFullYear();
      let month = old.getMonth() + 1;
      let day = old.getDate();
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }
  });
};
