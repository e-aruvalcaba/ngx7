import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetTypeComponent } from './fleet-type.component';

const routes: Routes = [
  {
    path: '', component: FleetTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetTypeRoutingModule { }
