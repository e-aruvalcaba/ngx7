import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetCoverageRoutingModule } from './fleet-coverage-routing.module';
import { FleetCoverageComponent } from './fleet-coverage.component';

@NgModule({
  declarations: [FleetCoverageComponent],
  imports: [
    CommonModule,
    FleetCoverageRoutingModule
  ]
})
export class FleetCoverageModule { }
