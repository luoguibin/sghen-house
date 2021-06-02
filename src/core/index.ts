import {
  Scene, WebGLRenderer, OrthographicCamera, PerspectiveCamera,
  AxesHelper, GridHelper, Object3D,
  Raycaster, Vector2, Camera,
} from "three";
import Wall from "./entities/wall";
import { OrbitControls } from './orbitcontrols';

export default class SgHouse {

  renderer: WebGLRenderer;
  camera: Camera;
  scene: Scene;

  controls: OrbitControls;
  raycaster: Raycaster = new Raycaster();
  rayPointer: Vector2 = new Vector2();
  currentObject: Object3D | undefined;

  /**
   * @param container 画布容器
   */
  constructor(container: HTMLDivElement) {
    const { clientWidth, clientHeight } = container;


    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene = new Scene();
    const aspect = clientWidth / clientHeight;
    // const camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0.01, 10);
    const camera = new PerspectiveCamera(50, aspect, 1, 1000)
    camera.position.set(0, 0, 15);
    camera.lookAt(this.scene.position);
    this.camera = camera;


    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.minZoom = 0.2;
    controls.maxZoom = 5;
    // 上下旋转范围
    controls.minPolarAngle = Math.PI * 1 / 10;
    controls.maxPolarAngle = Math.PI * 4 / 10;
    controls.addEventListener('click', e => {
      const { state, event } = e || {};
      switch (state) {
        case 0:
          // 左键点击
          const x = (event.clientX / window.innerWidth) * 2 - 1;
          const y = -(event.clientY / window.innerHeight) * 2 + 1;
          this.rayPointer.set(x, y);
          this.click();
          break;

        default:
          break;
      }
    })
    // 左右旋转范围
    // controls.minAzimuthAngle = -Math.PI;
    // controls.maxAzimuthAngle = Math.PI;
    controls.update();
    this.controls = controls;

    this.animate();

    this.addAxesGrid();
  }

  /**
   * 添加坐标轴和辅助网格
   */
  addAxesGrid() {
    const grid = new GridHelper(30, 30, 0x999999, 0x999999);
    this.scene.add(grid);

    const axesHelper = new AxesHelper(30);
    axesHelper.position.y = 0.001;
    this.scene.add(axesHelper);
  }

  /**
   * 更新画面
   */
  animate() {
    requestAnimationFrame(() => {
      this.animate();
    })

    this.renderer.render(this.scene, this.camera);
  }

  removeEntity() {
    if (this.currentObject) {
      this.scene.remove(this.currentObject)
      this.currentObject = undefined
    }
  }
  addEntity(...obj: Object3D[]) {
    this.scene.add(...obj);
  }
  addUnit(key: string, v: number) {
    const { position } = this.currentObject || {}
    if (!position) {
      return;
    }

    switch (key) {
      case 'x':
        position.x += v;
        break;
      case 'y':
        position.y += v;
        break;
      case 'z':
        position.z += v;
        break;
      default:
        break;
    }
  }
  addRotation(key: string, v: number) {
    const object = this.currentObject
    if (!object) {
      return;
    }

    switch (key) {
      case 'x':
        object.rotation.x += v;
        break;
      case 'y':
        object.rotation.y += v;
        break;
      case 'z':
        object.rotation.z += v;
        break;
      default:
        break;
    }
  }

  click() {
    this.raycaster.setFromCamera(this.rayPointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (this.currentObject instanceof Wall) {
      this.currentObject.setOpacity(1);
    }
    const list = intersects.filter(function (o) {
      return o && o.object && o.object.userData.isEntity;
    })

    if (list.length) {
      this.currentObject = list[0].object;
      if (this.currentObject instanceof Wall) {
        this.currentObject.setOpacity(0.8);
      }
    }
  }

  getData() {
    const list: Object[] = []
    this.scene.children.forEach(o => {
      if (o instanceof Wall) {
        list.push(o.getData())
      }
    })
    return list
  }
}