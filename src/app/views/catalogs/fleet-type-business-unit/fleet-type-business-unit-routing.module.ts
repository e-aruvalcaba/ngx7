import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetTypeBusinessUnitComponent } from './fleet-type-business-unit.component';

const routes: Routes = [
  {
    path: '', component: FleetTypeBusinessUnitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetTypeBusinessUnitRoutingModule { }
