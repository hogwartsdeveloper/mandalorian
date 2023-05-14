import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class ThreeWorldBase {
    renderer: THREE.WebGLRenderer;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth  / window.innerHeight,
        1,
        100
    );
    hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    dirLight = new THREE.DirectionalLight(0xffffff);
    control: OrbitControls;

    constructor(private sceneBackground: THREE.ColorRepresentation) {}

    init(canvas: HTMLCanvasElement) {
        this.scene.background = new THREE.Color( this.sceneBackground);
        this.scene.fog = new THREE.Fog( this.scene.background, 10, 100 );
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene.add(this.hemiLight);

        this.dirLight.shadow.camera.top = 2;
        this.dirLight.shadow.camera.bottom = - 2;
        this.dirLight.shadow.camera.left = - 2;
        this.dirLight.shadow.camera.right = 2;
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 40;
        this.scene.add(this.dirLight);

        this.control = new OrbitControls(this.camera, canvas);
        this.control.enablePan = false;
        this.control.enableZoom = false;

        this.control.update();

        const animate = () => {
            requestAnimationFrame(animate);
            this.animate();
            this.renderer.render(this.scene, this.camera);
        }
        animate();
        this.loadModel();
    }

    loadModel() {}
    animate() {}

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer?.setSize(window.innerWidth, window.innerHeight);
    }
}