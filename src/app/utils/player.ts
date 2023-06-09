import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {IParam} from "../models/utils.model";
import {SupportService} from "../services/support.service";

export class Player {
    private position = new THREE.Vector3(4.5, 0, 0);
    private velocity = 0.0;
    private playerBox = new THREE.Box3();
    private readonly params: IParam;
    private mesh: THREE.Group;
    private mixer: THREE.AnimationMixer;
    private animationActions: THREE.AnimationAction[] = [];
    private activeAction: THREE.AnimationAction;
    private lastAction: THREE.AnimationAction;
    private keys = {
        spaceBar: false,
        space: false
    }
    gameOver = false;
    keyTimeout: ReturnType<typeof setTimeout>

    constructor(params: IParam, private supportService: SupportService) {
        this.params = params;

        this.loadModel();
        this.initInput();
    }

    loadModel() {
        const loader = new FBXLoader();
        loader.setPath('/assets/models/');
        loader.load('mandalorian.fbx', (fbx) => {
            fbx.scale.setScalar(3);
            fbx.quaternion.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), Math.PI / 2
            );

            this.mesh = fbx;
            this.params.scene.add(this.mesh);

            fbx.traverse(obj => {
                const item = obj as THREE.Mesh;

                item.castShadow = true;
                item.receiveShadow = true;
            });

            this.mixer = new THREE.AnimationMixer(fbx);
            const animationAction = this.mixer.clipAction(fbx.animations[0]);
            this.animationActions.push(animationAction);
            this.activeAction = this.animationActions[0];
            this.setAction(this.animationActions[0]);

            loader.load('mandalorian-jump.fbx', (fbx) => {
                const animationAction = this.mixer.clipAction(fbx.animations[0]);
                this.animationActions.push(animationAction);
            })
        }, (xhr) => {
            if (xhr.loaded === 6098896) {
                this.supportService.isLoadingEnd.next(true);
            }
        });
    }

    initInput() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('click', () => {
            this.setAction(this.animationActions[1]);
            this.keys.space = true;
            this.setAction(this.animationActions[0]);
            clearTimeout(this.keyTimeout);
            this.keyTimeout = setTimeout(() => {
                this.keys.space = false;
            }, 300);
        })
    }

    onKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        switch (event.keyCode) {
            case 32:
                this.setAction(this.animationActions[1]);
                this.keys.space = true;
                this.setAction(this.animationActions[0]);
        }
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 32:
                this.keys.space = false;
        }
    }

    checkCollisions() {
        const colliders = this.params.world!.getColliders();
        this.playerBox.setFromObject(this.mesh);

        for (let collider of colliders) {
            const current = collider.collider;

            if (current.intersectsBox(this.playerBox)) {
                this.gameOver = true;
            }
        }
    }

    setAction(toAction: THREE.AnimationAction) {
        if (toAction !== this.activeAction) {
            this.lastAction = this.activeAction;
            this.activeAction = toAction;
            this.lastAction.fadeOut(1);
            this.activeAction.reset();
            this.activeAction.fadeIn(1);
            this.activeAction.play();
        }
        this.activeAction?.play();
    }

    update(timeElapsed: number) {
        if (this.keys.space && this.position.y == 0.0) {
            this.velocity = 25;
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