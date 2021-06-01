<template>
  <div ref="container" class="canvas-wrapper"></div>
  <div class="menus-wrapper">
    <div class="entities-panel">
      <button
        v-for="item in entities"
        :key="item.key"
        @click="onAddEntity(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import SgHouse from "./core/index.ts";
import Wall from "./core/entities/wall.ts";

// import "./core/index1.js";

export default defineComponent({
  name: "App",

  setup() {
    const entities = ref([{ key: "wall", label: "wall" }]);
    return {
      entities,
    };
  },

  mounted() {
    window.app = this;
    this.init();
  },

  methods: {
    init() {
      this.sgHouse = new SgHouse(this.$refs.container);
      window.sgHouse = this.sgHouse;
    },

    onAddEntity(key) {
      switch (key) {
        case "wall":
          this.sgHouse.addEntity(new Wall());
          break;

        default:
          break;
      }
    },
  },
});
</script>

<style scoped>
.canvas-wrapper {
  height: 100%;
}

.menus-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: transparent;
  pointer-events: none;
}

.entities-panel {
  pointer-events: initial;
}
</style>
