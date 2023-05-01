import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {math} from "./math";
export class BackgroundCloud {
    params: any
    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = 1.0;
    mesh: THREE.Group;
    constructor(params: any) {
        this.params = params;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.setPath('assets/clouds/');
        loader.load('Cloud' + math.randInt(1, 3) + '.glb', (glb) => {
            this.mesh = glb.scene;
            this.params.scene.add(this.mesh);

            this.position.x = math.randRange(0, 2000);
            this.position.y = math.randRange(100, 200);
            this.position.z = math.randRange(500, -1000);
            this.scale = math.randRange(10, 20);

            const q = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), math.randRange(0, 360)
            );
            this.quaternion.copy(q);

            this.mesh.traverse(item => {
                const el = (item as THREE.Mesh);
                if (el.geometry) {
                    el.geometry.computeBoundingBox();
                }

                let materials: THREE.Material[];
                if (!(el.material instanceof Array)) {
                    materials = [el.material];
                } else {
                    materials = el.material;
                }

                for (let material of materials) {
                    // @ts-ignore
                    material.specular = new THREE.Color(0x000000);
                    // @ts-ignore
                    material.emissive = new THREE.Color(0xC0C0C0);
                }

                el.castShadow = true;
                el.receiveShadow = true;
            })
        })
    }

    update(timeElapsed: number) {
        if (!this.mesh) {
            return;
        }

        this.position.x -= timeElapsed * 10;
        if (this.position.x < -100) {
            this.position.x = math.randRange(2000, 3000);
        }

        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
        this.mesh.scale.setScalar(this.scale);
    }
}