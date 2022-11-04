import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import * as paper from 'paper';
import { PaperPathModel, PaperRectangleModel } from 'src/app/models/paper.class';
import { DatabaseService } from 'src/app/services/database.service';
import { Path } from 'three';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {

  constructor(
    private databaseService: DatabaseService,
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // For using paper libs
    this.scope = new paper.PaperScope();
  }

  @ViewChild('canvas')
  private canvasRef?: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }

  private scope: paper.PaperScope;
  private project!: paper.Project;

  oldZoom = 1;
  zoom = 1;
  shiftIsDown = false;
  x = 0;
  y = 0;
  z = 0;

  @Output() ready: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    // For using paper libs
    this.scope = new paper.PaperScope();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let _project = params['project'];
      let _paper = params['paper'];

      const height = this.canvasRef?.nativeElement.offsetHeight;
      const width = this.canvasRef?.nativeElement.offsetWidth;

      this.project = new paper.Project(this.canvasRef?.nativeElement);
      this.project.view.center = new paper.Point(width / 8, height / 8);
      this.project.view.scale(this.zoom, -this.zoom);

      this.project.view.onMouseMove = (event: any) => {
        this.onMouseMove(event);
      };

      this.drawGrid(width, height, 10, 1);
      this.ready.emit(this.project);
      // Finalize view init in async
      setTimeout(
        () => {
          this.setZoom(2);
          this.loadPaper(_project, _paper)
        }, 1000);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftIsDown = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftIsDown = false;
    }
  }

  onZoomChange(event: any) {
    this.setZoom(this.zoom);
  }

  private setZoom(zoom: number) {
    this.project.view.scale(1 / this.oldZoom, 1 / -this.oldZoom);
    this.project.view.scale(zoom, -zoom);
    this.oldZoom = zoom;
    this.zoom = zoom;
    const height = this.canvasRef?.nativeElement.offsetHeight;
    const width = this.canvasRef?.nativeElement.offsetWidth;
    this.project.view.center = new paper.Point(width / (this.zoom * 2.5), height / (this.zoom * 2));
  }

  private onMouseMove(event: any) {
    this.x = event.point.x;
    this.y = event.point.y;
    this.cdr.detectChanges();
    return false;
  }

  private drawAxis() {
    let abscisse = new this.scope.Path();
    abscisse.closed = true;
    abscisse.add([0, 0], [100, 0], [100, -5], [120, 0], [100, 5], [100, 0]);
    (<any>abscisse).strokeColor = 'red';
    let ordonee = new this.scope.Path();
    ordonee.closed = true;
    ordonee.add([0, 0], [0, 100], [-5, 100], [0, 120], [5, 100], [0, 100]);
    (<any>ordonee).strokeColor = 'blue';
  }

  private drawGrid(width: number, height: number, heavy: number, light: number) {
    const canvas = new paper.Path.Rectangle(
      new paper.Point(0, 0),
      new paper.Point(width, height)
    );

    const ordonnee = new paper.Path.Line({
      from: new paper.Point(0, -height),
      to: new paper.Point(0, height),
      strokeColor: 'red',
      strokeWidth: 1
    });

    const abscisse = new paper.Path.Line({
      from: new paper.Point(-width, 0),
      to: new paper.Point(width, 0),
      strokeColor: 'blue',
      strokeWidth: 1
    });

    for (let x = -width; x < width; x += light) {
      const line = new paper.Path.Line({
        from: new paper.Point(x, 0),
        to: new paper.Point(x, height),
        strokeColor: 'lightblue',
        strokeWidth: (x % heavy === 0) ? 0.2 : 0.1
      });
    }

    for (let y = -height; y < height; y += light) {
      const line = new paper.Path.Line({
        from: new paper.Point(0, y),
        to: new paper.Point(height, y),
        strokeColor: 'lightblue',
        strokeWidth: (y % heavy === 0) ? 0.2 : 0.1
      });
    }
  }

  loadPaper(_projectId: string, _paperId: string): void {
    let _paper = this.databaseService.getPaper(_projectId, _paperId)
    this.logger.info(_paper)
    if (_paper) {
      switch (_paper.type) {
        case "rectangle":
          this.createRectangle(<PaperRectangleModel>_paper)
          break
        case "path":
          this.createPath(<PaperPathModel>_paper)
          break
      }
    }
  }

  createRectangle(_paper: PaperRectangleModel): paper.Rectangle {
    this.logger.info(_paper)
    let topLeft = new paper.Point(10, 10);
    let rectSize = new paper.Size(_paper.width, _paper.length);
    let rectangle = new this.scope.Rectangle(topLeft, rectSize);
    rectangle.selected = true
    let pathRectangle = new paper.Path.Rectangle(rectangle);
    let hue = Math.random() * 360;
    let lightness = (Math.random() - 0.5) * 0.4 + 0.4;
    (<any>pathRectangle).fillColor = { hue: hue, saturation: 1, lightness: lightness };
    (<any>pathRectangle).strokeColor = 'black';
    return rectangle;
  }

  createPath(_paper: PaperPathModel) {
    this.logger.info(new paper.Point(0, 0))
    var path = new this.scope.Path();
    path.closed = true;
    _.each(_.map((<PaperPathModel>_paper).path, (points) => {
      return new paper.Point(points[0], points[1])
    }), (point) => {
      path.add(point);
    });
    //path.smooth();
    let hue = Math.random() * 360;
    let lightness = (Math.random() - 0.5) * 0.4 + 0.4;
    (<any>path).fillColor = { hue: hue, saturation: 1, lightness: lightness };
    (<any>path).strokeColor = 'black';
    return path;
  }
}
