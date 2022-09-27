import { OrthographicCamera, PerspectiveCamera } from 'three'
import { gui } from './gui'
import { scene, sizes } from './renderer'

const VERTICAL_FIELD_OF_VIEW = 45 // degrees 45 is the normal

let perspectiveCamera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
)
perspectiveCamera.position.set(9, 4, 9)
perspectiveCamera.lookAt(0, 0, 0); 

let gameCamera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
)
gameCamera.position.set(9, 4, 9)
gameCamera.lookAt(0, 0, 0); 


let orthoCamera = new OrthographicCamera( 
  sizes.width / - 2, 
  sizes.width / 2, 
  sizes.height / 2, 
  sizes.height / - 2, 1, 500 
)
orthoCamera.position.set( 60, 30, 70 );
orthoCamera.lookAt(0, 0, 0); 
orthoCamera.zoom = 40

const camera = () => {
  switch (cameraType) {
    case "perspective":
      return perspectiveCamera
      break;
    case "orthographic":
      return orthoCamera
      break;
    case "game":
      return gameCamera
      break;
    default:
      return perspectiveCamera
  }
  // pers ? perspectiveCamera : orthoCamera
}

let cameraType = "perspective"

const persBtn = gui.addButton({
  title: 'perspective',
});
persBtn.controller_.view.element.style.background = "green"


persBtn.on('click', () => {
  orthoBtn.controller_.view.element.style.background = "transparent"
  gameBtn.controller_.view.element.style.background = "transparent"
  persBtn.controller_.view.element.style.background = "green"
  perspectiveCamera.updateProjectionMatrix()
  cameraType = "perspective"
});

const orthoBtn = gui.addButton({
  title: 'orthographic',
});

orthoBtn.on('click', () => {
  orthoBtn.controller_.view.element.style.background = "green"
  persBtn.controller_.view.element.style.background = "transparent"
  gameBtn.controller_.view.element.style.background = "transparent"
  orthoCamera.updateProjectionMatrix()
  cameraType = "orthographic"
});

const gameBtn = gui.addButton({
  title: 'game',
});

gameBtn.on('click', () => {
  gameBtn.controller_.view.element.style.background = "green"
  persBtn.controller_.view.element.style.background = "transparent"
  orthoBtn.controller_.view.element.style.background = "transparent"

  gameCamera.updateProjectionMatrix()
  cameraType = "game"
});

gui.addSeparator()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  perspectiveCamera.aspect = sizes.width / sizes.height
  gameCamera.aspect = sizes.width / sizes.height
  camera().updateProjectionMatrix()
})

scene.add(camera())
export { perspectiveCamera, orthoCamera, gameCamera, camera }
export default camera
