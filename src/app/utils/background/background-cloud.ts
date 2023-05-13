import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {math} from "../math";
import {IParam} from "../../models/utils.model";
import {BackgroundBase} from "./background.base";
export class BackgroundCloud extends BackgroundBase {
    constructor(params: IParam) {
        super(params);
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.setPath('/assets/clouds/');
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

                if (el.isMesh) {
                    el.material = new THREE.MeshPhongMaterial({
                        specular: new THREE.Color(0x000000),
                        emissive: new THREE.Color(0xC0C0C0)
                    });
                }

                el.castShadow = true;
                el.receiveShadow = true;
            })
        })
    }
}