import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";

export default class Wall extends Mesh {

  constructor(width: number = 4, height: number = 3, depth: number = 0.1) {
    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshBasicMaterial({ color: 0xaaaaaa });
    super(geometry, material)

    this.position.setY(height / 2);
  }
}