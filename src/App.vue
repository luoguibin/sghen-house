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
      <button @click="onCopyEntity">copy</button>
      <button @click="onDdownload">download</button>
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
      <div><span>wallType</span><input v-model="wallType" /></div>
      <div>
        <button @click="onAddEntity">ok</button>
        <button @click="entityKey = ''">no</button>
      </div>
    </div>

    <div v-if="objectParameters" style="width: 180px; color: white">
      <template v-if="objectParameters.parameters">
        <div>width:{{ objectParameters.parameters.width }}</div>
        <div>height:{{ objectParameters.parameters.height }}</div>
        <div>depth:{{ objectParameters.parameters.depth }}</div>
      </template>

      <div>wallType:{{ objectParameters.wallType }}</div>
      <template v-if="objectParameters.position">
        <div>x:{{ objectParameters.position.x }}</div>
        <div>y:{{ objectParameters.position.y }}</div>
        <div>z:{{ objectParameters.position.z }}</div>
      </template>
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
    const unit = ref(1);
    const rotation = ref(5);

    return {
      entities,
      unit,
      rotation,
      entityKey: ref(""),

      width: ref(4),
      height: ref(3),
      depth: ref(0.1),
      wallType: ref(0),

      objectParameters: ref(null),
    };
  },

  watch: {
    unit() {
      this.setUnits();
    },
    rotation() {
      this.setUnits();
    },
  },

  mounted() {
    window.app = this;
    this.init();
  },

  methods: {
    setUnits() {
      this.sgHouse.setUnits(+this.unit, +this.rotation);
    },
    init() {
      this.sgHouse = new SgHouse(this.$refs.container);
      this.sgHouse.addClickCall((object) => {
        if (object) {
          const oData = object.getData();
          this.width = oData.parameters.width;
          this.height = oData.parameters.height;
          this.depth = oData.parameters.depth;
          this.wallType = oData.wallType;
        }
        this.objectParameters = object?.getData();
      });
      window.sgHouse = this.sgHouse;

      const query = {};
      location.search
        .substring(1)
        .split("&")
        .forEach((v) => {
          const [key, value] = v.split("=");
          query[key] = value;
        });
      const name = query.dataName || "default";
      import(`./assets/data/${name}.json`).then((e) => {
        const list = e.default || e;
        list.forEach((o) => {
          const parameters = o.parameters;
          this.sgHouse.addEntity(
            new Wall(parameters.width, parameters.height, parameters.depth, {
              position: o.position,
              rotation: o.rotation,
              wallType: o.wallType,
            })
          );
        });
      });

      // this.onOpenEntity('wall')
      // this.width = 1;
      // this.height = 1;
      // this.depth = 1;
      // this.onAddEntity()
    },

    onOpenEntity(key) {
      this.entityKey = key;
    },
    onAddEntity() {
      switch (this.entityKey) {
        case "wall":
          this.sgHouse.addEntity(
            new Wall(this.width, this.height, this.depth, {
              wallType: this.wallType,
            })
          );
          break;

        default:
          break;
      }
      this.entityKey = "";
    },
    onRemoveEntity() {
      this.sgHouse.removeEntity();
    },
    onCopyEntity() {
      const o = this.objectParameters;
      if (!o) {
        return;
      }
      const pos = { x: o.position.x, y: o.position.y, z: o.position.z };
      pos.x = pos.x + 1;
      pos.z = pos.z + 1;
      const entity = new Wall(this.width, this.height, this.depth, {
        position: pos,
        rotation: o.rotation,
        wallType: o.wallType,
      });
      this.sgHouse.addEntity(entity);
      // this.sgHouse.testCopyEntity(entity);
    },
    onDdownload() {
      this.sgHouse.downloadJson();
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
