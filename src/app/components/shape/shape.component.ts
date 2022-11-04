import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css']
})
export class ShapeComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute
  ) { }

  @ViewChild('canvas')
  private canvasRef?: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }

  private renderer!: THREE.WebGLRenderer;

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private group = new THREE.Group();

  subscriptions: any = [];
  project?: string
  shape?: string

  ngOnInit(): void {
    this.logger.info("Loading shape")
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      this.project = params['project'];
      this.shape = params['shape'];

      this.clearScene()
      this.startRenderingLoop();
    });
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      _.each(this.subscriptions, (subscription) => {
        subscription.unsubscribe();
      })
    }
  }

  /**
  * Create the scene
  *
  * @private
  * @memberof CubeComponent
  */
  private clearScene() {
    // Add a global group
    this.scene.add(this.group)

    // camera
    this.camera = new THREE.PerspectiveCamera(45, this.getAspectRatio(), 1, 1000);
    this.camera.position.set(0, 15, 35);

    // Object
    let material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 150,
      specular: 0x222222
    });

    let geometry = new THREE.BoxGeometry(1000, 0.15, 1000);
    material = new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 150,
      specular: 0x111111
    });

    const ground = new THREE.Mesh(geometry, material);
    ground.scale.multiplyScalar(3);
    ground.castShadow = false;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Lights

    this.scene.add(new THREE.AmbientLight(0x404040));

    let spotLight = new THREE.SpotLight(0x404040);
    spotLight.name = 'Spot Light';
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.3;
    spotLight.position.set(5, 5, 5);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 30;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);

    this.scene.add(spotLight.shadow.camera);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.name = 'Dir. Light';
    dirLight.position.set(0, 10, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.left = - 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = - 15;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    this.scene.add(dirLight.shadow.camera);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private loadShape(scene: THREE.Scene) {
  }

  /**
  * Start the rendering loop
  *
  * @private
  * @memberof CubeComponent
  */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    let component: ShapeComponent = this;
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.enableKeys = true;
    controls.update();

    (function render() {
      requestAnimationFrame(render);
      component.renderer.render(component.scene, component.camera);
    }());
  }
}