import {IParam} from "../../models/utils.model";
import * as THREE from "three";
import {math} from "../math";

export class BackgroundBase {
    protected readonly params: IParam;
    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = 1.0;
    mesh: THREE.Group;

    constructor(params: IParam) {
        this.params = params;
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