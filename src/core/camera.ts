import { OrthographicCamera, PerspectiveCamera } from 'three'
import { gui } from './gui'
import { scene, sizes } from './renderer'

const VERTICAL_FIELD_OF_VIEW = 45 // degrees 45 is the normal

let perspectiveCamera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
)
let orthoCamera = new OrthographicCamera( 
  sizes.width / - 2, 
  sizes.width / 2, 
  sizes.height / 2, 
  sizes.height / - 2, 1, 500 );

perspectiveCamera.position.set(9, 4, 9)

orthoCamera.position.set( 60, 30, 70 );
orthoCamera.lookAt(0, 0, 0); 
orthoCamera.zoom = 40     // have camera look at 0,0,0

const camera = () => pers ? perspectiveCamera : orthoCamera

let pers = true

const persBtn = gui.addButton({
  title: 'perspective',
});
persBtn.controller_.view.element.style.background = "green"


persBtn.on('click', () => {
  orthoBtn.controller_.view.element.style.background = "transparent"
  persBtn.controller_.view.element.style.background = "green"

  perspectiveCamera.updateProjectionMatrix()
  pers = true
});

const orthoBtn = gui.addButton({
  title: 'orthographic',
});

orthoBtn.on('click', () => {
  console.log(orthoBtn.controller_.view.valueElement)
  orthoBtn.controller_.view.element.style.background = "green"
  persBtn.controller_.view.element.style.background = "transparent"

  orthoCamera.updateProjectionMatrix()
  pers = false
});

gui.addSeparator()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  perspectiveCamera.aspect = sizes.width / sizes.height
  camera().updateProjectionMatrix()
})

scene.add(camera())
export { perspectiveCamera, orthoCamera, camera }
export default camera
