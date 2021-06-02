<template>
  <div ref="container" class="canvas-wrapper"></div>
  <div class="menus-wrapper">
    <div class="entities-panel">
      <button
        v-for="item in entities"
        :key="item.key"
        @click="onOpenEntity(item.key)"
      >
        {{ item.label }}
      </button>

      <button @click="onRemoveEntity">remove</button>
    </div>
    <div class="unit-panel">
      <span>平移</span>
      <input v-model="unit" />
      <div>
        <button @click="onAddUnit('x', -1)">-</button><span>X</span
        ><button @click="onAddUnit('x', 1)">+</button>
      </div>
      <div>
        <button @click="onAddUnit('y', -1)">-</button><span>Y</span
        ><button @click="onAddUnit('y', 1)">+</button>
      </div>
      <div>
        <button @click="onAddUnit('z', -1)">-</button><span>Z</span
        ><button @click="onAddUnit('z', 1)">+</button>
      </div>
    </div>
    <div class="unit-panel">
      <span>旋转</span>
      <input v-model="rotation" />
      <div>
        <button @click="onAddRotation('x', -1)">-</button><span>X</span
        ><button @click="onAddRotation('x', 1)">+</button>
      </div>
      <div>
        <button @click="onAddRotation('y', -1)">-</button><span>Y</span
        ><button @click="onAddRotation('y', 1)">+</button>
      </div>
      <div>
        <button @click="onAddRotation('z', -1)">-</button><span>Z</span
        ><button @click="onAddRotation('z', 1)">+</button>
      </div>
    </div>

    <div class="unit-panel" v-show="entityKey">
      <div><span>width</span><input v-model="width" /></div>
      <div><span>height</span><input v-model="height" /></div>
      <div><span>depth</span><input v-model="depth" /></div>
      <div>
        <button @click="onAddEntity">ok</button>
        <button @click="entityKey = ''">no</button>
      </div>
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
      unit: ref(1),
      rotation: ref(5),
      entityKey: ref(""),

      width: ref(4),
      height: ref(3),
      depth: ref(0.1),
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

      import('@/assets/data/default.json').then(e => {
        const list = e.default || e;
        list.forEach(o => {
          this.sgHouse.addEntity(new Wall(o.width, o.height, o.depth, {
            position: o.position,
            rotation: o.rotation,
            wallType: o.wallType,
          }))
        });
      })
      // this.onOpenEntity('wall')
      // this.onAddEntity()
    },

    onOpenEntity(key) {
      this.entityKey = key;
    },
    onAddEntity() {
      switch (this.entityKey) {
        case "wall":
          this.sgHouse.addEntity(new Wall(this.width, this.height, this.depth));
          break;

        default:
          break;
      }
      this.entityKey = "";
    },
    onRemoveEntity() {
      this.sgHouse.removeEntity()
    },
    onAddUnit(key, ratio) {
      this.sgHouse.addUnit(key, this.unit * ratio);
    },
    onAddRotation(key, ratio) {
      this.sgHouse.addRotation(key, (this.rotation / 180) * Math.PI * ratio);
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

.entities-panel,
.unit-panel {
  pointer-events: initial;
}

.unit-panel {
  display: inline-block;
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0.3);
}
.unit-panel input {
  display: inline-block;
  width: 30px;
}
.unit-panel span {
  margin: 0 5px;
  color: white;
}
.unit-panel button {
  padding: 0 5px;
}
</style>
