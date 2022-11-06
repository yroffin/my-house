import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Tree } from 'primeng/tree';
import { ComponentModel, PaperModel, PaperRectangleModel } from 'src/app/models/paper.class';
import { DatabaseService } from 'src/app/services/database.service';
import * as THREE from 'three';
import { CameraHelper } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { PaperComponent } from '../paper/paper.component';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private databaseService: DatabaseService,
    private logger: NGXLogger,
    private route: ActivatedRoute
  ) { }

  @ViewChild('canvasDefault')
  private canvasDefaultRef?: ElementRef;

  private get canvasDefault(): HTMLCanvasElement {
    return this.canvasDefaultRef?.nativeElement;
  }

  @ViewChild('canvasHelper')
  private canvasHelperref?: ElementRef;

  private get canvasHelper(): HTMLCanvasElement {
    return this.canvasHelperref?.nativeElement;
  }

  private rendererDefault!: THREE.WebGLRenderer;
  private rendererHelper!: THREE.WebGLRenderer;

  private scene: THREE.Scene = new THREE.Scene();
  private cameraPerpective!: THREE.PerspectiveCamera;
  private cameraHelper!: THREE.PerspectiveCamera;
  private group = new THREE.Group();

  subscriptions: any = [];
  project?: string
  view?: string

  ngOnInit(): void {
    this.logger.info("Loading view")
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      this.project = params['project'];
      this.view = params['view'];

      this.clearScene()
      this.loadScene()
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
    this.cameraPerpective = new THREE.PerspectiveCamera(50, this.getAspectRatioDefault(), 1, 200000);
    this.cameraPerpective.position.x = 800;
    this.cameraPerpective.position.y = 5500;
    this.cameraPerpective.position.z = 800;
    this.cameraPerpective.lookAt(new THREE.Vector3(0, 0, 0))
    this.scene.add(new CameraHelper(this.cameraPerpective));

    this.cameraHelper = new THREE.PerspectiveCamera(50, this.getAspectRatioHelper(), 0.1, 200000);
    this.cameraHelper.position.x = 9800;
    this.cameraHelper.position.y = 2800;
    this.cameraHelper.position.z = 9800;
    this.cameraHelper.lookAt(new THREE.Vector3(0, 0, 0))

    // Object
    let material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 150,
      specular: 0x222222
    });

    let geometry = new THREE.BoxGeometry(100000, 0.15, 100000);
    material = new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 150,
      specular: 0x111111
    });

    const ground = new THREE.Mesh(geometry, material);
    ground.scale.multiplyScalar(3);
    ground.castShadow = true;
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

  private getAspectRatioDefault() {
    return this.canvasDefault.clientWidth / this.canvasDefault.clientHeight;
  }

  private getAspectRatioHelper() {
    return this.canvasHelper.clientWidth / this.canvasHelper.clientHeight;
  }

  private loadScene() {
    if (this.project) {
      let _components = this.databaseService.getComponents(this.project)
      _.each(_components, (component) => {
        this.logger.info(component)
        this.factoryPaper(component)
      })
    }
  }

  private factoryPaper(component: ComponentModel) {
    if (this.project) {
      // substring papers/...
      let paperId = component.from.substring(7)
      let _paper = this.databaseService.getPaper(this.project, paperId)
      this.logger.info("Load paper", paperId, _paper)

      const shape = _paper ? this.factoryRectagnlePaper(<PaperRectangleModel>_paper) : null

      if (shape) {
        let material = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          shininess: 150,
          specular: 0x222222
        });

        const mesh = new THREE.Mesh(shape, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);
      }
    }
  }

  private factoryRectagnlePaper(paper: PaperRectangleModel): THREE.ExtrudeGeometry {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, paper.length);
    shape.lineTo(paper.width, paper.length);
    shape.lineTo(paper.width, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 1,
      depth: paper.height,
      bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    return geometry
  }

  private startRenderingLoop() {
    // Renderer
    this.rendererDefault = new THREE.WebGLRenderer({ canvas: this.canvasDefault });
    this.rendererDefault.setPixelRatio(devicePixelRatio);
    this.rendererDefault.setSize(this.canvasDefault.clientWidth, this.canvasDefault.clientHeight);

    this.rendererDefault.shadowMap.enabled = true;
    this.rendererDefault.shadowMap.type = THREE.BasicShadowMap;
    this.rendererDefault.outputEncoding = THREE.sRGBEncoding;

    // Renderer
    this.rendererHelper = new THREE.WebGLRenderer({ canvas: this.canvasHelper });
    this.rendererHelper.setPixelRatio(devicePixelRatio);
    this.rendererHelper.setSize(this.canvasHelper.clientWidth, this.canvasHelper.clientHeight);

    this.rendererHelper.shadowMap.enabled = true;
    this.rendererHelper.shadowMap.type = THREE.BasicShadowMap;
    this.rendererHelper.outputEncoding = THREE.sRGBEncoding;

    let component: ThreejsComponent = this;
    const controls = new OrbitControls(this.cameraPerpective, this.rendererDefault.domElement);
    controls.minDistance = 0;
    controls.maxDistance = 200000;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableKeys = false;
    controls.target.set(0, 0, 0);
    controls.update();

    (function render() {
      requestAnimationFrame(render);
      component.rendererDefault.render(component.scene, component.cameraPerpective);
      component.rendererHelper.render(component.scene, component.cameraHelper);
    }());
  }
}

