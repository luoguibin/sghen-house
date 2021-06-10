import { BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, RepeatWrapping } from "three";

import imgSrc05 from "@/assets/img/zhuantou05_256.png";
import imgSrc02 from "@/assets/img/zhuantou02_256.png";
export default class Wall extends Mesh {

  material: MeshBasicMaterial;
  wallType: number;

  constructor(width: number = 4, height: number = 3, depth: number = 0.1, options: any = {}) {
    const geometry = new BoxGeometry(
      width,
      height,
      depth,
    );
    // geometry.addAttribute('uv')

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(options.wallType === 5 ? imgSrc05 : imgSrc02)
    texture.repeat.set(width, height);
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    // color: 0xaaaaaa, wireframe: false,
    const material = new MeshBasicMaterial({ map: texture, transparent: true, wireframe: false });
    super(geometry, material);

    this.material = material;
    this.position.setY(height / 2);

    if (options.position) {
      this.position.set(options.position.x, options.position.y, options.position.z)
    }
    if (options.rotation) {
      this.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
    }

    this.wallType = options.wallType || 0;
    this.userData.isEntity = true;
  }

  getData(): Object {
    return {
      parameters: this.geometry.parameters,
      wallType: this.wallType,
      position: this.position,
      rotation: this.rotation.toVector3(),
    }
  }

  setOpacity(v: number) {
    this.material.opacity = v;
  }
}