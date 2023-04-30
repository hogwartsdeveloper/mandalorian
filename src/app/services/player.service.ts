import {Injectable} from '@angular/core';
import * as THREE from 'three';

@Injectable({providedIn: 'root'})
export class PlayerService {
  player: THREE.Mesh;
  velocity = 0;
  position = new THREE.Vector3(-40, -30, 0);
  keys: {space: boolean} = {
    space: false
  }

  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 32:
        this.keys.space = true;
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 32:
        this.keys.space = false;
        break;
    }
  }

  init(scene: THREE.Scene) {
    this.player = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({
          color: 0x80ff80
        })
    );
    this.player.position.y = -30;
    this.player.castShadow = true;
    this.player.receiveShadow = true;

    scene.add(this.player);
  }

  update(time: number) {
    if (this.keys.space && this.position.y === -30) {
      this.velocity = 30;
    }
    const acceleration = -45 * time;
    this.position.y += time * (this.velocity + acceleration * 0.5);
    this.position.y = Math.max(this.position.y, -30);

    this.velocity += acceleration;
    this.velocity = Math.max(this.velocity, -100);

    if (this.player) {
      this.player.position.copy(this.position);
    }
  }
}
