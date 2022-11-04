import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Tree } from 'primeng/tree';
import { ComponentModel, PaperModel, PaperRectangleModel } from 'src/app/models/paper.class';
import { DatabaseService } from 'src/app/services/database.service';
import * as THREE from 'three';
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
    this.camera = new THREE.PerspectiveCamera(50, this.getAspectRatio(), 0.1, 2000);
    this.camera.position.set(0, 1500, 50);

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

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
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
    shape.lineTo(0, paper.width);
    shape.lineTo(paper.length, paper.width);
    shape.lineTo(paper.length, 0);
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
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    let component: ThreejsComponent = this;
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

