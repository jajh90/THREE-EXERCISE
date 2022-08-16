import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Galaxy
const params = {
    count: 100000,
    size: 0.01,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    spiralY: false,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',

}

let particlesGeometry, particlesMaterial, particles = null

const generateGalaxy = () => {
    // Dispoe old galaxy
    if (particles !== null) {
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        scene.remove(particles)
    }
// Particles
    // Geometry
    particlesGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)

    const colorInside = new THREE.Color(params.insideColor)
    const colorOutside = new THREE.Color(params.outsideColor)
    // Material
    particlesMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: params.sizeAttenuation,
        depthWrite: params.depthWrite,
        blending: params.blending,
        vertexColors: true
    })
    // Assign positions
    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3
        
        const radius = Math.random() * params.radius
        const spinAngle = radius * params.spin
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2
        
        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        
        if (params.spiralY) {
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX + (radius * randomX) * ((Math.random() < 0.5 ? 1 : -1) + 2)
            positions[i3 + 1] = randomY * Math.random() + radius + (radius * randomY) * ((Math.random() < 0.5 ? 1 : -1) - 2)
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ + (radius * randomZ) * ((Math.random() < 0.5 ? 1 : -1) + 2)
        } else {
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX + (radius * randomX)
            positions[i3 + 1] = randomY * Math.random() * radius + randomY + Math.random()
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ + (radius * randomZ)
        }
        
        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / params.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
}

gui.add(params, 'count', 100, 1000000, 100).onFinishChange(generateGalaxy)
gui.add(params, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(params, 'branches', 2, 20, 1).onFinishChange(generateGalaxy)
gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'spiralY').onFinishChange(generateGalaxy)
gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy)

generateGalaxy()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 14
camera.position.y = 14
camera.position.z = 14
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()