import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true
})
export class LoadingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  renderer: THREE.WebGLRenderer;
  camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth  / window.innerHeight,
      1,
      100
  );
  mixer: THREE.AnimationMixer;

  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  count = 0;
  timeout: ReturnType<typeof setInterval>;
  ngOnInit() {
  }

  ngAfterViewInit() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1b1b1b);
    scene.fog = new THREE.Fog( scene.background, 10, 100 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas?.nativeElement });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.position.set(0, 0, 40)

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 10, 10, 10 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 10, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add( dirLight );

    const controls = new OrbitControls(this.camera, this.canvas.nativeElement);
    controls.enablePan = false;
    controls.enableZoom = false;

    this.loadModel(scene);
    controls.update();
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      let delta = Math.min(clock.getDelta(), 0.1);
      this.mixer?.update(delta);

      this.renderer.render(scene, this.camera);
    }

    animate();
  }

  loadModel(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    loader.load('/assets/models/dark-saber2.glb', (glb) => {
      const model = glb.scene;
      model.scale.setScalar(1.2);
      model.rotation.set(1.5, 0, 0);
      model.position.set(10, 0, 0)
      scene.add(model);

      model.traverse( function ( object ) {
        object.castShadow = true;
        object.receiveShadow = true;
      });

      this.mixer = new THREE.AnimationMixer(glb.scene);
      const animationAction = this.mixer.clipAction(glb.animations[0]).play();
      setTimeout(() => {
        animationAction.paused = true;
      }, 2900);
      this.timeout = setInterval(() => {
        this.count++;
        if (this.count === 100) {
          clearInterval(this.timeout);
        }
      }, 30)
      this.audio.nativeElement.volume = 0.19;
      this.audio.nativeElement.play();
    });
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }
}
