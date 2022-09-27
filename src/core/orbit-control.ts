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
  });


controls.enableDamping = true
