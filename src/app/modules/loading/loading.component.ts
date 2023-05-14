import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ThreeWorldBase} from "../../utils/three-world.base";
import {SupportService} from "../../services/support.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true
})
export class LoadingComponent extends ThreeWorldBase implements AfterViewInit, OnDestroy {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;
  @ViewChild('canvas') container: ElementRef<HTMLCanvasElement>;
  mixer: THREE.AnimationMixer;
  count = 0;
  timeout: ReturnType<typeof setInterval>;
  clock = new THREE.Clock();
  animationPauseTime: ReturnType<typeof setTimeout>;

  @HostListener('window:resize', ['$event'])
  windowResize() {
    this.resize();
  }

  constructor(private supportService: SupportService) {
    super(0x1b1b1b);
  }

  ngAfterViewInit() {
    this.init(this.container?.nativeElement);
    this.camera.position.set(0, 0, 40);
    this.hemiLight.position.set( 10, 10, 10 );
    this.dirLight.position.set( 10, 10, 10 );

    clearInterval(this.timeout)
    this.timeout = setInterval(() => {
      this.count++;
      if (this.count === 100) {
        clearInterval(this.timeout);
      }
    }, 30);
  }

  override loadModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/dark-saber.glb', (glb) => {
      const model = glb.scene;
      model.scale.setScalar(0.7);
      model.rotation.set(1.5, 0, 0);
      model.position.set(2.5, 0, 0);
      this.scene.add(model);

      model.traverse( function ( object ) {
        object.castShadow = true;
        object.receiveShadow = true;
      });

      this.mixer = new THREE.AnimationMixer(glb.scene);
      const animationAction = this.mixer.clipAction(glb.animations[0]).play();

      clearTimeout(this.animationPauseTime);
      this.animationPauseTime = setTimeout(() => {
        animationAction.paused = true;
      }, 1900);

      this.audio.nativeElement.volume = 0.19;
      this.audio.nativeElement.play().catch(() => console.log('user not interact'));

    }, (xhr) => {
      console.log(xhr)
      if (xhr.loaded === 454508) {
        this.supportService.isLoadingEnd.next(true);
      }
    });
  }

  override animate() {
    let delta = Math.min(this.clock.getDelta(), 0.1);
    this.mixer?.update(delta);
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
    clearTimeout(this.animationPauseTime);
  }
}
