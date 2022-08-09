// Scene
const scene = new THREE.Scene()

// Red Cub
// geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
// material
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
// mesh
const mesh = new THREE.Mesh(geometry, material)
// add mesh to the scene
scene.add(mesh)

// Aspect ratio for the camera
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height ) // params: fov, aspect ratio
// camera position
camera.position.z = 4
camera.position.x = 1
camera.position.y = 1
// add camera to the scene
scene.add(camera)

// grab the canvas from the DOM
const canvas = document.querySelector('.webgl')
// Renderer
// put the renderer in the canvas from the DOM
const renderer = new THREE.WebGLRenderer({
  canvas: canvas 
})
// canvas size
renderer.setSize(sizes.width, sizes.height)

// render the scene and the camera
renderer.render(scene, camera)
