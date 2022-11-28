import Experience from "../Experience";
import * as THREE from "three"

export default class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64)
  }
  setTextures() {
    this.textures = {}

    this.textures.color = this.resources.items.dirtColorTexture
    this.textures.color.encoding = THREE.sRGBEncoding
    this.textures.color.repeat.set(1, 1)
    this.textures.color.WrapS = THREE.RepeatWrapping
    this.textures.color.WrapT = THREE.RepeatWrapping

    this.textures.normal = this.resources.items.dirtNormalTexture
    this.textures.normal.repeat.set(1, 1)
    this.textures.normal.WrapS = THREE.RepeatWrapping
    this.textures.normal.WrapT = THREE.RepeatWrapping
  }
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal
    })
  }
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = - Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}