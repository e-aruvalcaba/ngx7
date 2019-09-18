import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyPlantCapacityRoutingModule } from './daily-plant-capacity-routing.module';
import { DailyPlantCapacityComponent } from './daily-plant-capacity.component';

@NgModule({
  declarations: [DailyPlantCapacityComponent],
  imports: [
    CommonModule,
    DailyPlantCapacityRoutingModule
  ]
})
export class DailyPlantCapacityModule { }
