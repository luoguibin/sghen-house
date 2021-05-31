import * as THREE from 'three';
import { OrbitControls } from './orbitcontrols/index';

let camera, scene, renderer;
const frustumSize = 500;

init();
animate();

function init() {

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

  camera.position.set( - 200, 200, 200 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );


  const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );

  // left
  createPlane(
    100, 100,
    'chocolate',
    new THREE.Vector3( - 50, 0, 0 ),
    new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 )
  );
  // right
  createPlane(
    100, 100,
    'saddlebrown',
    new THREE.Vector3( 0, 0, 50 ),
    new THREE.Euler( 0, 0, 0 )
  );
  // top
  createPlane(
    100, 100,
    'yellowgreen',
    new THREE.Vector3( 0, 50, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
  );
  // bottom
  createPlane(
    300, 300,
    'seagreen',
    new THREE.Vector3( 0, - 50, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
  );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );



  const controls = new OrbitControls( camera, renderer.domElement );
  controls.minZoom = 0.5;
  controls.maxZoom = 2;

  function createPlane( width, height, cssColor, pos, rot ) {
    const geometry = new THREE.PlaneGeometry( width, height );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

  }

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

  requestAnimationFrame( animate );

  renderer.render( scene, camera );

}