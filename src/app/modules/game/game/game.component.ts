import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {Background} from "../../../utils/background";
import {WorldManager} from "../../../utils/world-manager";
import {Player} from "../../../utils/player";
import {Subject, takeUntil} from "rxjs";
import {ScoreService} from "../../../services/score.service";
import {LevelService} from "../../../services/level.service";
import {pcss, pcssGetShadow, skyFragmentShader, skyVertexShader} from "../../../models/three.model";
import {AudioService, AudioState} from "../../../services/audio.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('main') main: ElementRef<HTMLDivElement>
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>
  loading = true;
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      20000
  );
  gameOver = false;
  previousTime: number;
  score = 0;
  maxScore = 0
  background: Background;
  world: WorldManager;
  player: Player;
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  audioState: AudioState;
  audioStateEnum = AudioState;
  destroy$ = new Subject();

  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  constructor(
      private scoreService: ScoreService,
      private levelService: LevelService,
      private audioService: AudioService
  ) {
    this.maxScore = this.scoreService.getMaxScore();
    this.audioState = this.audioService.state;
  }

  ngOnInit() {
    this.levelService.level$
        .pipe(takeUntil(this.destroy$))
        .subscribe(level => {
          if (this.world) {
            this.world.updateSpeed(12 + (2 * level));
          }
        })
  }

  ngAfterViewInit() {
    this.onStart()
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
    this.load();
    setTimeout(() => {
      this.loading = false;
      this.audioService.start(this.audio?.nativeElement);
    }, 5000)

  }

  onRestart() {
    this.world.restart();
    this.maxScore = this.scoreService.restart();
    this.gameOver = false;
    this.player.gameOver = false;
    this.audioService.restart(this.audio.nativeElement);
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
    if (this.gameOver) {
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

  onAudio(event) {
    event.stopPropagation();
    this.audioState = this.audioState === AudioState.On ? AudioState.Off : AudioState.On;
    this.audioService.setState(this.audioState, this.audio?.nativeElement);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
