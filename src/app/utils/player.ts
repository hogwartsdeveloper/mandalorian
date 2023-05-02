import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

export class Player {
    position = new THREE.Vector3(0, 0, 0);
    velocity = 0.0;
    playerBox = new THREE.Box3();
    params: any;
    mesh: THREE.Group;
    mixer: THREE.AnimationMixer;
    keys = {
        spaceBar: false,
        space: false
    }
    oldKeys = { ...this.keys }
    gameOver = true;

    constructor(params: any) {
        this.params = params;

        this.loadModel();
        this.initInput();
    }

    loadModel() {
        const loader = new FBXLoader();
        loader.setPath('/assets/models/');
        loader.load('Velociraptor.fbx', (fbx) => {
            fbx.scale.setScalar(0.0025);
            fbx.quaternion.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), Math.PI / 2
            );

            this.mesh = fbx;
            this.params.scene.add(this.mesh);

            fbx.traverse(obj => {
                const item = obj as THREE.Mesh;

                let materials;
                if (!(item.material instanceof Array)) {
                    materials = [item.material];
                } else {
                    materials = item.material;
                }

                for (let material of materials) {
                    // @ts-ignore
                    material.specular = new THREE.Color(0x000000);
                    // @ts-ignore
                    material.color.offsetHSL(0, 0, 0.25);
                }

                item.castShadow = true;
                item.receiveShadow = true;
            });

            this.mixer = new THREE.AnimationMixer(fbx);

            for (let i = 0; i < fbx.animations.length; ++i) {
                if (fbx.animations[i].name.includes('Run')) {
                    const clip = fbx.animations[i];
                    const action = this.mixer.clipAction(clip);
                    action.play();
                }
            }
        })
    }

    initInput() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 32:
                this.keys.space = true;
        }
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 32:
                this.keys.space = false;
        }
    }

    checkCollisions() {
        const colliders = this.params.world.getColliders();
        this.playerBox.setFromObject(this.mesh);

        for (let collider of colliders) {
            const current = collider.collider;

            if (current.intersectsBox(this.playerBox)) {
                this.gameOver = true;
            }
        }
    }

    update(timeElapsed: number) {
        if (this.keys.space && this.position.y == 0.0) {
            this.velocity = 30;
        }

        const acceleration = -75 * timeElapsed;

        this.position.y += timeElapsed * (
            this.velocity + acceleration * 0.5
        );

        this.position.y = Math.max(this.position.y, 0.0);

        this.velocity += acceleration;
        this.velocity = Math.max(this.velocity, -100);

        if (this.mesh) {
            this.mixer.update(timeElapsed);
            this.mesh.position.copy(this.position);
            this.checkCollisions();
        }
    }
}