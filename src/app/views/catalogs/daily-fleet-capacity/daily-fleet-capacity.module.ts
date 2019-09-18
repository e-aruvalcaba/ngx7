import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyFleetCapacityRoutingModule } from './daily-fleet-capacity-routing.module';
import { DailyFleetCapacityComponent } from './daily-fleet-capacity.component';

@NgModule({
  declarations: [DailyFleetCapacityComponent],
  imports: [
    CommonModule,
    DailyFleetCapacityRoutingModule
  ]
})
export class DailyFleetCapacityModule { }
