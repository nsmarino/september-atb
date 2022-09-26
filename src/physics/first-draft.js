import * as THREE from 'three'
import * as CANNON from "cannon-es"
import { renderer, scene } from '../core/renderer'
import { fpsGraph, gui } from '../core/gui'
import camera from '../core/camera'
import { controls, persControls } from '../core/orbit-control'
import * as utils from './utils'
import "../style.css"
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


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  sphereMaterial,
)

sphere.position.set(0, 2, 0)
sphere.castShadow = true
scene.add(sphere)

// GUI for lights
// const DirectionalLightFolder = gui.addFolder({
//   title: 'Directional Light',
// })

// Object.keys(directionalLight.position).forEach(key => {
//   DirectionalLightFolder.addInput(
//     directionalLight.position,
//     key,
//     {
//       min: -100,
//       max: 100,
//       step: 1,
//     },
//   )
// })

const plane = utils.createPlane(scene)

// Just used as reference in gameloop
const clock = new THREE.Clock()

// LOOP
const loop = () => {
  const elapsedTime = clock.getElapsedTime()

  sphereMaterial.uniforms.uTime.value = elapsedTime

  fpsGraph.begin() // wrap around renderer

  controls.update()
  persControls.update()
  const cameraToRender = camera()
  renderer.render(scene, cameraToRender)

  fpsGraph.end()
  requestAnimationFrame(loop)
}

console.log("first draft")
loop()
