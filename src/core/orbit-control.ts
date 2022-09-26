import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { orthoCamera, perspectiveCamera } from './camera'
import { renderer } from './renderer'
import { gui } from './gui'

export const controls = new OrbitControls(orthoCamera, renderer.domElement)
export const persControls = new OrbitControls(perspectiveCamera, renderer.domElement)

const resetBtn = gui.addButton({
    title: 'reset camera',
  });
  
  resetBtn.on('click', () => {
    controls.reset()
    persControls.reset()
    // perspectiveCamera.position.set(9, 4, 9)
  
    // orthoCamera.position.set( 60, 30, 70 );
    // orthoCamera.lookAt(0, 0, 0); 
    // orthoCamera.zoom = 40     // have camera look at 0,0,0
    
    // perspectiveCamera.updateProjectionMatrix()
    // orthoCamera.updateProjectionMatrix()
  });


controls.enableDamping = true
