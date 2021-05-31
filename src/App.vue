<template>
  <div ref="container" class="canvas-wrapper"></div>
  <div class="menus-wapper"></div>
</template>

<script>
import { defineComponent } from "vue";
import SgHouse from "./core/index.ts";

// import "./core/index1.js";

export default defineComponent({
  name: "App",

  setup() {},

  mounted() {
    window.app = this;
    this.init();
  },

  methods: {
    init() {
      this.sgHouse = new SgHouse(this.$refs.container);
      window.sgHouse = this.sgHouse;
    },
  },
});
</script>

<style scoped>
.canvas-wrapper {
  height: 100%;
}

.menus-wapper {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  pointer-events: none;
}
</style>
