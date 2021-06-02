import { BoxGeometry, MeshBasicMaterial, Mesh, CanvasTexture, Wrapping, RepeatWrapping } from "three";
import IMesh from '../interfaces/imesh'

import imgSrc05 from "@/assets/img/zhuantou05_256.png";
import imgSrc02 from "@/assets/img/zhuantou02_256.png";
export default class Wall extends Mesh implements IMesh {

  material: MeshBasicMaterial;

  width: number;
  height: number;
  depth: number;
  wallType: number;

  constructor(width: number = 4, height: number = 3, depth: number = 0.1, options: any = {}) {
    const geometry = new BoxGeometry(
      width,
      height,
      depth,
      Math.floor(Math.max(width, 1)),
      Math.floor(Math.max(height, 1)),
      Math.floor(Math.max(depth, 1)),
    );

    const img = new Image(256, 256);
    if(options.wallType === 5) {
      img.src = imgSrc05;
    } else {
      img.src = imgSrc02;
    }
    const shadowTexture = new CanvasTexture(img, undefined, RepeatWrapping, RepeatWrapping);
    shadowTexture.repeat.set(width / 1.5, height / 1.5);

    // color: 0xaaaaaa, wireframe: false,
    const material = new MeshBasicMaterial({ map: shadowTexture, transparent: true });
    super(geometry, material);

    this.material = material;
    this.position.setY(height / 2);

    if (options.position) {
      this.position.set(options.position.x, options.position.y, options.position.z)
    }
    if (options.rotation) {
      this.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
    }

    this.width = width;
    this.height = height;
    this.depth = depth;
    this.wallType = options.wallType || 0;
    this.userData.isEntity = true;
  }

  getData(): Object {
    return {
      width: this.width,
      height: this.height,
      depth: this.depth,
      wallType: this.wallType,
      position: this.position,
      rotation: this.rotation.toVector3(),
    }
  }

  setOpacity(v: number) {
    this.material.opacity = v;
  }
}