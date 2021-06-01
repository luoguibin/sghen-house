import { BoxGeometry, MeshBasicMaterial, Mesh, CanvasTexture } from "three";

export default class Wall extends Mesh {

  material: MeshBasicMaterial;

  constructor(width: number = 4, height: number = 3, depth: number = 0.1) {
    const geometry = new BoxGeometry(
      width,
      height,
      depth,
      Math.floor(Math.max(width, 1)),
      Math.floor(Math.max(height, 1)),
      Math.floor(Math.max(depth, 1)),
    );

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
      gradient.addColorStop(0.1, 'rgba(210,210,210,1)');
      gradient.addColorStop(1, 'rgba(55,155,215,1)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    const shadowTexture = new CanvasTexture(canvas);

    // color: 0xaaaaaa, wireframe: false,
    const material = new MeshBasicMaterial({ map: shadowTexture, transparent: true, });
    super(geometry, material);

    this.material = material;
    this.position.setY(height / 2);
  }

  setOpacity(v: number) {
    this.material.opacity = v;
  }
}