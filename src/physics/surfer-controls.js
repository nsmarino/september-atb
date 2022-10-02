import * as THREE from 'three'
import * as CANNON from "cannon-es"
import { renderer, scene } from '../core/renderer'
import { fpsGraph, gui } from '../core/gui'
import camera, { gameCamera } from '../core/camera'
import * as utils from './utils'
import { OrthographicCamera, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import "../style.css"
// Shaders
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'

import { sizes } from '../core/renderer'
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
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: "#fff",    // red (can also use a CSS color string here)
  flatShading: true,
});
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  sphereMaterial,
)
sphere.position.set(0, 1, 0)
sphere.castShadow = true
scene.add(sphere)

const refSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  sphereMaterial,
)
sphere.add(refSphere)
refSphere.position.y = 2

const cameraTarget = new THREE.Object3D()
sphere.add(cameraTarget)

const imposterCam = new THREE.Object3D()
imposterCam.position.copy(gameCamera.position)
sphere.add(imposterCam)

const plane = utils.createPlane(scene)

const VERTICAL_FIELD_OF_VIEW = 45 // degrees 45 is the normal

const playerCamera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
)

cameraTarget.add(playerCamera)
// x y z
playerCamera.position.set(0, 10, 25)
playerCamera.lookAt(cameraTarget.position)

playerCamera.updateProjectionMatrix()

function getSine(tick, speed, offset) {
  var x = 1;
  var y = 0;
  var amplitude = speed;
  var frequency = 0.25
  var height = 1
  var x = 1;
  var y = 0;

  y = height/2 + amplitude * Math.sin((x+tick)/frequency);
  x++;

  return y + offset
}

const speed= 0.02
const camR =  () => cameraTarget.rotateY(speed)
const camL =  () => cameraTarget.rotateY(-speed)
const camUp =  () => {
  if (cameraTarget.rotation.x <= 0) cameraTarget.rotateX(speed)
}
const camDown=  () => {
  if (cameraTarget.rotation.x >= -1) cameraTarget.rotateX(-speed)
}
class SurferControls extends THREE.EventDispatcher {
  constructor(camera) {
    super()
    this.camera = camera
    this.enabled = true
    this.dir = new THREE.Vector3()

    this.rotationDelay = 0.1

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.camUp = false
    this.camDown = false
    this.camLeft = false
    this.camRight = false

    this.connect()
  }

  connect() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  onKeyDown = (event) => {
    switch (event.code) {

      // MOVEMENT:
      case 'KeyE':
        this.moveForward = true
        break

      case 'KeyS':
        this.moveLeft = true
        break

      case 'KeyD':
        this.moveBackward = true
        break

      case 'KeyF':
        this.moveRight = true
        break

      // CAMERA:
      case 'KeyI':
        this.camUp = true
        break

      case 'KeyL':
        this.camLeft = true
        break

      case 'KeyK':
        this.camDown = true
        break

      case 'KeyJ':
        this.camRight = true
        break

      // Use pattern for both jump and interact
      // case 'Semicolon':
      //   if (this.canJump) {
      //     this.velocity.y = this.jumpVelocity
      //   }
      //   this.canJump = false
      //   break

      // case 'KeyA':
      //   if (this.interactTarget) {
      //     this.interactTarget(interactTarget)
      //   }
      //   break

      // case 'Space':
      //   if (this.canOpenMenu) {
      //   }
      //   break
    }
  }

  onKeyUp = (event) => {
    switch (event.code) {

      // MOVEMENT:
      case 'KeyE':
        this.moveForward = false
        break

      case 'KeyS':
        this.moveLeft = false
        break

      case 'KeyD':
        this.moveBackward = false
        break

      case 'KeyF':
        this.moveRight = false
        break

      // CAMERA:
      case 'KeyI':
        this.camUp = false
        break

      case 'KeyL':
        this.camLeft = false
        break

      case 'KeyK':
        this.camDown = false
        break

      case 'KeyJ':
        this.camRight = false
        break

      // Use pattern for both jump and interact
      // case 'Semicolon':
      //   if (this.canJump) {
      //     this.velocity.y = this.jumpVelocity
      //   }
      //   this.canJump = false
      //   break

      // case 'KeyA':
      //   if (this.interactTarget) {
      //     this.interactTarget(interactTarget)
      //   }
      //   break

      // case 'Space':
      //   if (this.canOpenMenu) {
      //   }
      //   break
    }
  }

  update() {
    if (this.camUp) {
      camUp()
    }
    if (this.camDown) {
      camDown()
    }

    if (this.camLeft) {
      camL()
    }
    if (this.camRight) {
      camR()
    }
    // if (this.moveForward) {
    //   this.cannonBody.position.z -= this.dir.z
    // }
    // if (this.moveBackward) {
    //   this.cannonBody.position.z += this.speed
    // }

    // if (this.moveLeft) {
    //   this.cannonBody.position.x -= this.speed
    // }
    // if (this.moveRight) {
    //   this.cannonBody.position.x += this.speed
    // }
  }
}

const surferControls = new SurferControls()

// LOOP
const loop = () => {

  surferControls.update()

  // const elapsedTime = clock.getElapsedTime()
  // orbiter.scale.x = getSine(elapsedTime, 0.5, 1)
  // orbiter.scale.y = getSine(elapsedTime, 0.5, 1)
  // orbiter.scale.z = getSine(elapsedTime, 0.25, 0.5)

  renderer.render(scene, gameCamera)

  requestAnimationFrame(loop)
}

console.log("first draft")
loop()
