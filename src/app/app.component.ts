import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {skyFragmentShader, skyVertexShader} from "./models/three.model";
import {PlayerService} from "./services/player.service";
import {WorldManagerService} from "./services/world-manager.service";

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
  score = '00000'
  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  constructor(
      private playerService: PlayerService,
      private worldManager: WorldManagerService
  ) {}
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
    this.playerService.init(this.scene);
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

  animate() {
    const animation = () => {
      this.render();
    }

    this.renderer.setAnimationLoop(animation);
  }

  render() {
    const delta = this.clock.getDelta();
    this.playerService.update(delta);
    this.worldManager.update(this.scene, delta);
    this.score = this.worldManager.updateScore(delta);
    this.renderer.render(this.scene, this.camera);
  }
}
