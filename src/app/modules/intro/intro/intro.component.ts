import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ThreeWorldBase} from "../../../utils/three-world.base";
import {SupportService} from "../../../services/support.service";
import {delay, take} from "rxjs";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent extends ThreeWorldBase implements AfterViewInit {
  @ViewChild('main') main: ElementRef<HTMLDivElement>;
  loading = true;
  constructor(
      private router: Router,
      private supportService: SupportService
  ) {
    super(0xfffae7);
  }

  @HostListener('window:resize', ['$event'])
  windowResize() {
    this.resize();
  }

  ngAfterViewInit() {
    this.supportService.isLoadingEnd.pipe(delay(5000), take(1)).subscribe(() => {
      this.loading = false;
      this.main.nativeElement.style.display = 'block';
    });

    this.main.nativeElement.style.display = 'none';
    const canvas = document.createElement('canvas');
    this.main.nativeElement.appendChild(canvas);
    this.init(canvas);
    this.camera.position.set(0, 0, 40);
    this.hemiLight.position.set( 0, 20, 0 );
    this.dirLight.position.set( 3, 10, 10 );
  }

  override loadModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/mandalorian-intro2.glb', (glb) => {
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
