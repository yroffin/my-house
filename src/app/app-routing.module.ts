import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShapeComponent } from './components/shape/shape.component';
import { ShapesComponent } from './components/shapes/shapes.component';

const routes: Routes = [
  { path: 'shapes', component: ShapesComponent },
  { path: 'shapes/:shape', component: ShapeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
