<template>
  <div class="h-full flex w-72">
    <div class="friend-item h-full">
      <div v-for="item in $store.state.friendList" :key="item.title">
        <p class="ml-2" :id="'friend-' + item.title">{{ item.title }}</p>
        <div
          v-for="friend in item.friend"
          :key="friend._id"
          class="h-16 flex items-center box-border cursor-pointer hover:bg-gray-200"
          @click="goChat(friend)"
          @contextmenu.prevent="showMenu(friend)"
        >
          <img
            :src="friend.avatar"
            alt=""
            class="w-12 h-12 rounded-full mr-3 ml-2"
          />
          <div class="inf-box mr-1 flex-1">
            <div class="flex justify-between">
              <p class="nowrap-hidden">{{ friend.notename }}</p>
            </div>
            <p class="nowrap-hidden text-sm w-44">
              {{ friend.notename || friend.nickname }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="jump flex-1 text-center absolute right-3 top-16">
      <ul class="p-0 m-0">
        <li
          v-for="item in $store.state.friendList"
          :key="item.title"
          class="m-0.5"
        >
          <a :href="'#friend-' + item.title">{{ item.title }}</a>
        </li>
        <!-- <li v-for="item in mList" :key="item" class="m-0.5">
          <a :href="'#friend-' + item">{{ item }}</a>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { getFriends } from "@/service/getData";
import { getSessionStorage } from "@/utils/localOps";
import pyjs from "js-pinyin";
export default {
  data() {
    return {
      mList: "ABCDEFGHIGKLMNOPQRSTUVWXYZ".split(""),
      block: [],
      list: [],
    };
  },
  async created() {
    // let res = await getFriends({ selfID: getSessionStorage("userID") });
    // if (res.code == 200) {
    //   this.list = res.friends;
    // }
    // this.format();
    // console.log(this.block);
  },
  methods: {
    format() {
      let p,
        c,
        d = { "#": [] };
      let blocks = [];
      this.list.forEach((item) => {
        p = pyjs
          .getFullChars(item.notename || item.nickname)
          .toLocaleLowerCase()
          .slice(0, 1);
        c = p.charCodeAt(0);
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = [];
          }
          d[p].push(item);
        } else {
          d["#"].push(item);
        }
      });
      for (let [k, v] of Object.entries(d)) {
        if (k != "#") {
          blocks.push({
            title: k.toUpperCase(),
            friend: v,
          });
        }
      }
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      if (d["#"].length) {
        blocks.push({
          title: "#",
          friend: d["#"],
        });
      }

      this.block = blocks;
    },
    goChat(people) {
      // console.log(people);
      this.$store.commit("addChating", people);
      this.$store.commit("setCurPeople", people);
      this.$router.push(`/chat/${people._id}`);
      // console.log(this.$store.state.chating);
    },
  },
  async mounted() {},
};
</script>

<style lang="scss" scoped>
</style>