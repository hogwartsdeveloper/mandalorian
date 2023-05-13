import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {IParam} from "../models/utils.model";

export class WorldObject {
    private readonly params: IParam;
    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = 1;
    collider = new THREE.Box3();
    mesh: THREE.Group;

    constructor(params: IParam) {
        this.params = params;
        this.loadModel();
    }

    loadModel() {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/assets/textures/Ground.png');

        const loader = new FBXLoader();
        loader.setPath('/assets/models/');
        loader.load('Cactus3.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            this.mesh = fbx;
            this.params.scene.add(this.mesh);

            fbx.traverse(obj => {
                const item = obj as THREE.Mesh;
                if (item.geometry) {
                    item.geometry.computeBoundingBox();
                }

                if (item.isMesh) {
                    item.material = new THREE.MeshPhongMaterial(
                        {map: texture, specular: new THREE.Color(0x000000)}
                    )
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            })
        })
    }

    updateCollider() {
        this.collider.setFromObject(this.mesh);
    }

    update() {
        if (!this.mesh) {
            return;
        }

        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
        this.mesh.scale.setScalar(this.scale);
        this.updateCollider();
    }
}