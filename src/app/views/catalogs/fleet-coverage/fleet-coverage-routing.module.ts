import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetCoverageComponent } from './fleet-coverage.component';

const routes: Routes = [
  {
    path: '', component: FleetCoverageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetCoverageRoutingModule { }
