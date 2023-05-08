import {WorldObject} from "./world-object";
import * as THREE from 'three';
import {math} from "./math";

const START_POS = 100;
const SEPARATION_DISTANCE = 20;

export class WorldManager {
    private objects: WorldObject[] = [];
    private unused: WorldObject[] = [];
    private speed = 12;
    private params: any;
    private separationDistance = SEPARATION_DISTANCE;

    constructor(params: any) {
        this.params = params;
    }

    getColliders() {
        return this.objects;
    }

    lastObjectPosition(): number {
        if (this.objects.length === 0) {
            return SEPARATION_DISTANCE;
        }

        return this.objects[this.objects.length - 1].position.x;
    }

    spawnObj(scale: any, offset: any) {
        let obj: WorldObject;

        if (this.unused.length > 0) {
            obj = this.unused.pop() as WorldObject;
            obj.mesh.visible = true;
        } else {
            obj = new WorldObject(this.params);
        }

        obj.quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
        obj.position.x = START_POS + offset;
        obj.scale = scale * 0.01;
        this.objects.push(obj);
    }

    spawnCluster() {
        const scaleIndex = math.randInt(0, 1);
        const scales = [1.5, 1];
        const ranges = [2, 3];
        const scale = scales[scaleIndex];
        const numObjects = math.randInt(1, ranges[scaleIndex]);

        for (let i = 0; i < numObjects; ++i) {
            const offset = i * scale;
            this.spawnObj(scale, offset);
        }
    }

    maybeSpawn() {
        const closest = this.lastObjectPosition();
        if (Math.abs(START_POS - closest) > this.separationDistance) {
            this.spawnCluster();
            this.separationDistance = math.randRange(SEPARATION_DISTANCE, SEPARATION_DISTANCE * 1.5);
        }
    }

    update(timeElapsed: number) {
        this.maybeSpawn();
        this.updateColliders(timeElapsed);
    }

    updateColliders(timeElapsed: number) {
        const invisible: WorldObject[] = [];
        const visible: WorldObject[] = [];

        for (let obj of this.objects) {
            obj.position.x -= timeElapsed * this.speed;

            if (obj.position.x < -20) {
                invisible.push(obj);
                obj.mesh.visible = false;
            } else {
                visible.push(obj);
            }

            obj.update(timeElapsed)
        }

        this.objects = visible;
        this.unused.push(...invisible);
    }

    restart() {
        this.objects.forEach(obj => {
            this.params.scene.remove(obj.mesh);
        });
        this.objects = [];
    }
}