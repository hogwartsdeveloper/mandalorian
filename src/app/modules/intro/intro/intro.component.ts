import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements AfterViewInit {
  @ViewChild('container') canvas: ElementRef<HTMLCanvasElement>;
  renderer: THREE.WebGLRenderer;
  camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      100
  );
  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  ngAfterViewInit() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xfffae7);
    scene.fog = new THREE.Fog( scene.background, 10, 100 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas?.nativeElement });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.position.set(0, 0, 40)

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 3, 10, 10 );
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
    const animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(scene, this.camera);

    }

    animate();
  }

  loadModel(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    loader.load('/assets/models/mandalorian-intro.glb', (glb) => {
      const model = glb.scene;
      model.scale.setScalar(0.0015);
      model.position.set(0, -28, -5)

      scene.add(model);

      model.traverse( function ( object ) {
        object.castShadow = true;
      });
    });
  }

  onPlayGame() {
    this.router.navigate(['/game']);
  }

  goToSocial(link: string) {
    window.open(link, '_blank');
  }
}
