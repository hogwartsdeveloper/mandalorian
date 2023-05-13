import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ThreeWorldBase} from "../../../utils/three-world.base";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent extends ThreeWorldBase implements AfterViewInit {
  @ViewChild('container') container: ElementRef<HTMLCanvasElement>;

  constructor(private router: Router) {
    super(0xfffae7);
  }

  @HostListener('window:resize', ['$event'])
  windowResize() {
    this.resize();
  }

  ngAfterViewInit() {
    this.init(this.container?.nativeElement);
    this.camera.position.set(0, 0, 40);
    this.hemiLight.position.set( 0, 20, 0 );
    this.dirLight.position.set( 3, 10, 10 );
  }

  override loadModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/mandalorian-intro.glb', (glb) => {
      const model = glb.scene;
      model.scale.setScalar(0.0015);
      model.position.set(0, -28, -5)

      this.scene.add(model);

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
