import * as THREE from 'three'
import { renderer, scene } from '../core/renderer'
import { fpsGraph, gui } from '../core/gui'
import camera from '../core/camera'
import { controls } from '../core/orbit-control'

// Shaders
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'


export function createPlane(scene) {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        new THREE.MeshToonMaterial({ color: '#444' }),
        )
        plane.rotation.set(-Math.PI / 2, 0, 0)
        plane.receiveShadow = true
        scene.add(plane)
    return plane
}