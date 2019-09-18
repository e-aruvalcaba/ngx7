import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyFleetCapacityComponent } from './daily-fleet-capacity.component';

const routes: Routes = [
  {
    path: '', component: DailyFleetCapacityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyFleetCapacityRoutingModule { }
