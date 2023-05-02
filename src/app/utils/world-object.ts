import * as THREE from 'three';

export class WorldObject {
    params: any;
    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = 1;
    collider = new THREE.Box3();

    constructor(params: any) {
        this.params = params;
    }

    loadModel() {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/assets/textures/Ground.png')
    }
}