import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyPlantCapacityComponent } from './daily-plant-capacity.component';

const routes: Routes = [
  {
    path: '', component: DailyPlantCapacityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyPlantCapacityRoutingModule { }
