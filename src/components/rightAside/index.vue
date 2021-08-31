<template>
  <div class=" flex justify-center items-center">
    <Contact />
    <Chat />
  </div>
</template>

<script>
import Contact from "@/components/contact/index.vue";
import Chat from "@/components/chat/index.vue";
export default {
  name: "rightAside",
  components: {
    Contact,
    Chat,
  },
};
</script>

<style lang="scss" scoped>
</style>