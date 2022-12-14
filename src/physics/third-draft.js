import * as THREE from 'three'
import * as CANNON from "cannon-es"
import CannonDebugger from 'cannon-es-debugger';

import { renderer, scene } from '../core/renderer'
import { fpsGraph, gui } from '../core/gui'
import camera from '../core/camera'
import { controls, persControls } from '../core/orbit-control'
import * as utils from './utils'
import "../style.css"
import introWav from '../../assets/intro.wav'
import click from '../../assets/click.wav'

import GameObject from './gameObject';

// AUDIO
const myAudio = document.createElement("audio");
myAudio.src = introWav;
// document.addEventListener("click", () => myAudio.play())

const btnFx = document.createElement("audio");
btnFx.src = click
btnFx.volume = 0.2
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    btnFx.play()
  })
})

// Shaders
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'

// Place lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, 2.25)

scene.add(directionalLight)


// PLACE SPHERE -

// use shader as a material
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(20, 15) },
  },
  vertexShader,
  fragmentShader,
})


// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   sphereMaterial,
// )

// sphere.position.set(0, 2, 0)
// sphere.castShadow = true
// scene.add(sphere)

const plane = utils.createPlane(scene)


const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// create a ground body with a static plane
const groundBody = new CANNON.Body({
  // type: CANNON.Body.STATIC,
  // infinte geometric plane
  shape: new CANNON.Plane(),
});

// rotate ground body by 90 degrees
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.y = -5
physicsWorld.addBody(groundBody);
// When a body collides with another body, they BOTH dispatch the "collide" event.
groundBody.addEventListener('collide', (event) => {
  console.log('The groundBody emits this event.')
  console.log('The event.body is the other body that the groundBody collides with.', event.body)
  event.body.position.set(0,7,0)
  console.log('Contact between bodies:', event.contact)
})


const platformBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.1)),
});
platformBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(platformBody);

// create a sphere and set it at y=10
const radius = 1;
const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 7, 0);
physicsWorld.addBody(sphereBody);

const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
  // color: 0xff0000,
});


// EXAMPLE MESH (The following section imitates what I'd load from GLTF)
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(1,10,0)
////////////////////////////////////////////////////////////////

const boxBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
boxBody.position.copy(boxMesh.position);



const gameObject = new GameObject()
gameObject.addMesh(boxMesh, scene)
gameObject.addBody(boxBody, physicsWorld)


myquat = new THREE.Quaternion(); // now, Probably from one of these:

const clock = new THREE.Clock()
// LOOP
const loop = () => {

  // for shader
  const elapsedTime = clock.getElapsedTime()
  sphereMaterial.uniforms.uTime.value = elapsedTime

  physicsWorld.fixedStep();
  cannonDebugger.update();

  gameObject.update()

  fpsGraph.begin() // wrap around renderer

  controls.update()
  persControls.update()
  const cameraToRender = camera()
  renderer.render(scene, cameraToRender)

  fpsGraph.end()
  requestAnimationFrame(loop)
}

console.log("third draft")
loop()
