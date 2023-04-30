import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {skyFragmentShader, skyVertexShader} from "./models/three.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('main') canvas: ElementRef<HTMLCanvasElement>
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
  );
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  clock = new THREE.Clock();
  keys = {
    space: false
  }
  player: THREE.Mesh;
  velocity = 0;
  position = new THREE.Vector3(0, -30, 0);

  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 32:
        this.keys.space = true;
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 32:
        this.keys.space = false;
        break;
    }
  }

  ngAfterViewInit() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas.nativeElement });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

    this.camera.position.set(0, 0, 250);

    this.setLight();
    this.setGround();
    this.setSky();
    this.setPlayer();
    this.animate();
  }

  setLight() {
    this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
    this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    this.hemiLight.position.set( 0, 50, 0 );

    this.scene.add(this.hemiLight);

    this.dirLight.color.setHSL( 0.1, 1, 0.95 );
    this.dirLight.position.set( - 1, 1.75, 1 );
    this.dirLight.position.multiplyScalar( 30 );
    this.scene.add( this.dirLight );

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    this.dirLight.shadow.camera.left = - d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = - d;

    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = - 0.0001;
  }

  setGround() {
    const groundGeo = new THREE.PlaneGeometry(10000, 10000);
    const groundMat = new THREE.MeshLambertMaterial({color: 0xffffff });
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  setSky() {
    const uniforms = {
      'topColor': { value: new THREE.Color( 0x0077ff ) },
      'bottomColor': { value: new THREE.Color( 0xffffff ) },
      'offset': { value: 33 },
      'exponent': { value: 0.6 }
    };
    uniforms[ 'topColor' ].value.copy( this.hemiLight.color );

    this.scene.fog!.color.copy( uniforms[ 'bottomColor' ].value );

    const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      side: THREE.BackSide
    } );

    const sky = new THREE.Mesh( skyGeo, skyMat );
    this.scene.add( sky );
  }

  setPlayer() {
    this.player = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({
          color: 0x80ff80
        })
    );
    this.player.position.y = -30;
    this.player.castShadow = true;
    this.player.receiveShadow = true;

    this.scene.add(this.player);
  }

  updatePlayer(time: number) {
    if (this.keys.space && this.position.y === -30) {
      this.velocity = 30;
    }

    const acceleration = -75 * time;
    this.position.y += time * (this.velocity + acceleration * 0.5);
    this.position.y = Math.max(this.position.y, -30);

    this.velocity += acceleration;
    this.velocity = Math.max(this.velocity, -100);

    if (this.player) {
      this.player.position.copy(this.position);
    }
  }

  animate() {
    const animation = () => {
      this.render();
    }

    this.renderer.setAnimationLoop(animation);
  }

  render() {
    const delta = this.clock.getDelta();
    this.updatePlayer(delta)
    this.renderer.render(this.scene, this.camera);
  }
}
