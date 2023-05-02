import * as THREE from 'three';
import {math} from "./math";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
export class BackgroundCrap {
    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = 1.0;
    mesh: THREE.Group;
    params: any

    constructor(params: any) {
        this.params = params;
        this.loadModel();
    }

    loadModel() {
        const assets = [
            ['SmallPalmTree.glb', 'PalmTree.png', 3],
            ['BigPalmTree.glb', 'PalmTree.png', 5],
            ['Skull.glb', 'Ground.png', 1],
            ['Scorpion.glb', 'Scorpion.png', 1],
            ['Pyramid.glb', 'Ground.png', 40],
            ['Monument.glb', 'Ground.png', 10],
            ['Cactus1.glb', 'Ground.png', 5],
            ['Cactus2.glb', 'Ground.png', 5],
            ['Cactus3.glb', 'Ground.png', 5],
        ];

        const [asset, textureName, scale] = assets[math.randInt(0, assets.length - 1)];
        const textLoader = new THREE.TextureLoader();
        const texture = textLoader.load('/assets/textures' + textureName);
        texture.encoding = THREE.sRGBEncoding;

        const loader = new GLTFLoader();
        loader.setPath('/assets/models/');
        loader.load(asset as string, (glb) => {
            this.mesh = glb.scene;
            this.params.scene.add(this.mesh);

            this.position.x = math.randRange(0, 2000);
            this.position.z = math.randRange(500, -1000);
            this.scale = scale as number;

            const q = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), math.randRange(0, 360)
            );
            this.quaternion.copy(q);

            this.mesh.traverse(item => {
                const el = item as THREE.Mesh;
                let materials;
                if (!(el.material instanceof Array)) {
                    materials = [el.material];
                } else {
                    materials = el.material;
                }

                for (let material of materials) {
                    if (texture) {
                        // @ts-ignore
                        material.map = texture
                    }
                    // @ts-ignore
                    material.specular = new THREE.Color(0x000000);
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