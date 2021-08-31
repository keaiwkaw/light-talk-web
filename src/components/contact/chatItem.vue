<template>
  <div class="h-full">
    <div class="chat-item h-full">
      <div
        v-for="chat in chating"
        :key="chat._id"
        class="h-16 flex items-center box-border cursor-pointer relative"
        @click="goChat(chat)"
      >
        <div
          class="bg-red-600 w-4 h-4 rounded-full flex justify-center items-center text-white text-xs absolute top-0 left-1"
          v-show="chat.count"
        >
          {{ chat.count }}
        </div>
        <img
          :src="chat.avatar"
          alt=""
          class="w-12 h-12 rounded-full mr-3 ml-2"
        />
        <div class="inf-box mr-1 flex-1">
          <div class="flex justify-between">
            <p class="nowrap-hidden w-3/5">{{ chat.nickname }}</p>
            <p
              class="time-box w-2/5 flex justify-center items-center font-light text-xs"
            >
              {{ chat.endTime | dealTime }}
            </p>
          </div>
          <p class="nowrap-hidden w-3/5 font-light text-xs mt-1">
            {{ chat.endMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChatingPeople } from "@/utils/localOps";
import { mapState } from "vuex";
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {},
  computed: {
    ...mapState(["chating"]),
  },
  methods: {
    goChat(people) {
      this.$store.commit("addChating", people);
      this.$store.commit("setCurPeople", people);
      this.$router.push(`/chat/${people._id}`);
      this.$store.commit('clearChatingCount',people)
    },
  },
};
</script>

<style scoped>
</style>