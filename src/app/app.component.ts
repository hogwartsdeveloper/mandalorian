import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {pcss, pcssGetShadow, skyFragmentShader, skyVertexShader} from "./models/three.model";
import {Background} from "./utils/background";
import {WorldManager} from "./utils/world-manager";
import {Player} from "./utils/player";
import {ScoreService} from "./services/score.service";
import {Subject, takeUntil} from "rxjs";
import {LevelService} from "./services/level.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('container') main: ElementRef<HTMLDivElement>
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>
  loading = false;
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
  );
  gameStarted = false;
  gameOver = false;
  previousTime: number;
  score = 0;
  maxScore = 0
  background: Background;
  world: WorldManager;
  player: Player;
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  destroy$ = new Subject();

  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 32 && !this.gameStarted) {
      this.onStart();
    }
  }

  constructor(
      private scoreService: ScoreService,
      private levelService: LevelService
  ) {
    this.maxScore = this.scoreService.getMaxScore();
  }

  ngOnInit() {
    this.levelService.level$
        .pipe(takeUntil(this.destroy$))
        .subscribe(level => {
          if (this.world) {
            this.world.updateSpeed(12 + (5 * level));
          }
        })
  }

  load() {
    this.init();
    this.setLight();
    this.setGround();
    this.setSky()
    this.animate();
  }

  init() {
    let shadowCode = THREE.ShaderChunk.shadowmap_pars_fragment;
    shadowCode = shadowCode.replace(
        '#ifdef USE_SHADOWMAP',
        '#ifdef USE_SHADOWMAP' + pcss
    );
    shadowCode = shadowCode.replace(
        '#if defined( SHADOWMAP_TYPE_PCF )',
        pcssGetShadow +
        '#if defined( SHADOWMAP_TYPE_PCF )'
    );

    THREE.ShaderChunk.shadowmap_pars_fragment = shadowCode;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.main.nativeElement.appendChild(this.renderer.domElement)
    this.camera.position.set(-5, 5, 10);
    this.camera.lookAt(8, 3, 0);

    this.scene.background = new THREE.Color(0x808080);
    this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

    this.world = new WorldManager({ scene: this.scene });
    this.player = new Player({ scene: this.scene, world: this.world });
    this.background = new Background({ scene: this.scene });
  }

  setLight() {
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 7, 0);
    this.scene.add(this.hemiLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(60, 100, 10);
    light.target.position.set(40, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.far = 200.0;
    light.shadow.camera.near = 1;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    this.scene.add(light);
  }

  setGround() {
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20000, 20000, 10, 10),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xffffff).setHSL( 0.095, 1, 0.75 )
        }));

    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
  }

  setSky() {
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077FF) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 }
    };

    uniforms[ 'topColor' ].value.copy( this.hemiLight.color );
    this.scene.fog!.color.copy( uniforms[ 'bottomColor' ].value );

    const skyGeo = new THREE.SphereGeometry(1000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      side: THREE.BackSide,
    });

    this.scene.add(new THREE.Mesh(skyGeo, skyMat));
  }

  onStart() {
    this.loading = true;
    this.load();
    setTimeout(() => {
      this.loading = false;
      this.gameStarted = true;
      this.audio.nativeElement.volume = 0.19
      this.audio.nativeElement.play();
    }, 4000)

  }

  onRestart() {
    this.world.restart();
    this.maxScore = this.scoreService.restart();
    this.gameOver = false;
    this.player.gameOver = false;
    this.audio.nativeElement.currentTime = 0;
  }

  animate() {
    const animation = (time: number) => {
      if (!this.previousTime) {
        this.previousTime = time;
      }
      this.step((time - this.previousTime) / 1000);
      this.renderer.render(this.scene, this.camera);
      this.previousTime = time;
    }

    this.renderer.setAnimationLoop(animation);
  }

  step(timeElapsed: number) {
    if (this.gameOver || !this.gameStarted) {
      return
    }
    this.player.update(timeElapsed);
    this.world.update(timeElapsed);
    this.score = this.scoreService.updateScore(timeElapsed);
    this.background.update(timeElapsed);

    if (this.player.gameOver && !this.gameOver) {
      this.gameOver = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
