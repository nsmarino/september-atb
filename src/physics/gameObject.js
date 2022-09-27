// GameObject components
const m_addMesh = (obj) => ({
  addMesh(mesh, scene) {
      obj.mesh = mesh
      scene.add(obj.mesh)
  }
})
const m_addBody = (obj) => ({
  addBody(body, world) {
      obj.body = body
      world.addBody(obj.body)
  }
})

function GameObject() {
  // properties
  let gameObject = {
    mesh: null,
    body: null,
    start: () => {console.log("Start")},
    update: () => {
      gameObject.mesh.position.copy(gameObject.body.position);
      gameObject.mesh.quaternion.copy(gameObject.body.quaternion);
    },
  }
  function addMethod (method) {
    Object.assign(
      gameObject,
      method(gameObject)
    )
  }
  addMethod(m_addMesh)
  addMethod(m_addBody)
  return gameObject
}


// console.log("game object")
// const gameObject = new GameObject("mesh", "body")
// console.log(gameObject)
// gameObject.start()
// gameObject.handleClick()

export default GameObject
// class Behavior {


// }

// class Mesh {
//   constructor(geometry, material) {
//     this.geometry = geometry
//     this.material = material
//   }
// }
// class Body {
//   constructor(mass, shape) {
//     this.geometry = geometry
//     this.material = material
//   }
// }

// class GameObject {
//   constructor(mesh, body){
//     this.mesh = mesh
//     this.body = body

//     this.init()
//   }

//   init(){
//     console.log("start")
//     console.log(this.mesh)
//   }

//   update(){
//     console.log("update")
//   }

//   onCollide(){
//     console.log("collision")
//   }

//   onClick(){

//   }
//   onKeyDown(){

//   }

//   addComponent() {

//   }
// }
// const mesh = {
//   geometry: "cube",
//   material: "blue"
// }
// const body = {
//   mass: 1,
//   shape: "cube"
// }
// const gameObject = new GameObject(mesh, body)
