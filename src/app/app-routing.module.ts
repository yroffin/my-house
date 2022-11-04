import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperComponent } from './components/paper/paper.component';
import { ShapeComponent } from './components/shape/shape.component';
import { ThreejsComponent } from './components/threejs/threejs.component';

const routes: Routes = [
  { path: 'projects/:project/papers/:paper', component: PaperComponent },
  { path: 'projects/:project/shapes/:shape', component: ShapeComponent },
  { path: 'projects/:project/views/:view', component: ThreejsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
