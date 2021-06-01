import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";

export default class Wall extends Mesh {

  constructor(width: number = 3, height: number = 4, depth: number = 0.1) {
    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshBasicMaterial({ color: 0xaaaaaa });
    super(geometry, material)
  }
}