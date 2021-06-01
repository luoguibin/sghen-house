import {
  Scene, WebGLRenderer, OrthographicCamera,
  AxesHelper, GridHelper, Object3D,
} from "three";
import { OrbitControls } from './orbitcontrols';

export default class SgHouse {

  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;

  controls: OrbitControls;

  /**
   * 画面缩放比为画布容器clientWidth / clientHeight
   * @param container 画布容器
   */
  constructor(container: HTMLDivElement) {
    const { clientWidth, clientHeight } = container;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const aspect = 1; // clientWidth / clientHeight;
    const camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0.01, 10);
    camera.lookAt(0, 0, 0);
    camera.position.set(0, 0, 5);
    this.camera = camera;

    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.minZoom = 0.2;
    controls.maxZoom = 5;
    // 上下旋转范围
    controls.minPolarAngle = Math.PI * 1 / 10;
    controls.maxPolarAngle = Math.PI * 4 / 10;
    // 左右旋转范围
    // controls.minAzimuthAngle = -Math.PI;
    // controls.maxAzimuthAngle = Math.PI;
    controls.update();
    this.controls = controls;

    this.scene = new Scene();
    this.animate();

    this.addAxesGrid()
  }

  /**
   * 添加坐标轴和辅助网格
   */
  addAxesGrid() {
    const grid = new GridHelper(10, 10, 0x999999, 0x999999);
    this.scene.add(grid);

    const axesHelper = new AxesHelper(10);
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

  addEntity(...obj: Object3D[]) {
    this.scene.add(...obj);
  }
}