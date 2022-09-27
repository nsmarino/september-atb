import * as THREE from 'three'
import * as CANNON from "cannon-es"

class GameControls extends THREE.EventDispatcher {
  constructor(camera, cannonBody) {
    super()
    this.camera = camera
    this.enabled = false
    this.dir = new THREE.Vector3()

    this.cannonBody = cannonBody

    this.speed = 0.1
    this.jumpVelocity = 10

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.canJump = false

    const contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new CANNON.Vec3(0, 1, 0)
    this.cannonBody.addEventListener('collide', (event) => {
      const { contact } = event

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === this.cannonBody.id) {
        // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal)
      } else {
        // bi is something else. Keep the normal as it is
        contactNormal.copy(contact.ni)
      }

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) {
        // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true
      }
    })

    this.velocity = this.cannonBody.velocity

    this.connect()
  }

  connect() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  onKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true
        break

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true
        break

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true
        break

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true
        break

      case 'Space':
        if (this.canJump) {
          this.velocity.y = this.jumpVelocity
        }
        this.canJump = false
        break
    }
  }

  onKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false
        break

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false
        break

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false
        break

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false
        break
    }
  }

  update(camera) {
    if (this.enabled === false) {
      return
    }

    if (this.moveForward) {
      this.cannonBody.position.z -= this.dir.z
    }
    if (this.moveBackward) {
      this.cannonBody.position.z += this.speed
    }

    if (this.moveLeft) {
      this.cannonBody.position.x -= this.speed
    }
    if (this.moveRight) {
      this.cannonBody.position.x += this.speed
    }
  }
}

export { GameControls }
