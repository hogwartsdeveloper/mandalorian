import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class WorldManagerService {
  objects: THREE.Mesh[] = [];
  unused: THREE.Mesh[] = [];
  speed = 10;
  START_POS = 120;
  SEPARATION_DISTANCE = 20;
  score = 0;

  spawnObj(scene: THREE.Scene) {
    const obj = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 2.5, 2.5),
        new THREE.MeshStandardMaterial({
          color: 0xff8080
        })
    );

    obj.position.x = this.START_POS;
    obj.position.y = -30
    scene.add(obj);
    this.objects.push(obj);
  }

  maybeSpawn(scene: THREE.Scene) {
    const closest = this.lastObjectPosition();
    if (Math.abs(this.START_POS - closest) > this.SEPARATION_DISTANCE) {
      this.spawnObj(scene);
    }
  }

  lastObjectPosition(): number {
    if (this.objects.length === 0) {
      return 20;
    }

    return this.objects[this.objects.length - 1].position.x;
  }

  update(scene: THREE.Scene, time: number) {
    this.maybeSpawn(scene);
    const invisible: THREE.Mesh[] = [];
    const visible: THREE.Mesh[] = [];

    for (let obj of this.objects) {
      obj.position.x -= time * this.speed;

      if (obj.position.x < -120) {
        invisible.push(obj);
        obj.visible = false;
      } else {
        visible.push(obj);
      }
    }

    this.objects = visible;
    this.unused.push(...invisible);
  }

  updateScore(time: number) {
    this.score += time * 10;
    return Math.round(this.score).toLocaleString(
        'en-US', {minimumIntegerDigits: 5, useGrouping: false});
  }
}
