import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypeBusinessUnitRoutingModule } from './fleet-type-business-unit-routing.module';
import { FleetTypeBusinessUnitComponent } from './fleet-type-business-unit.component';

@NgModule({
  declarations: [FleetTypeBusinessUnitComponent],
  imports: [
    CommonModule,
    FleetTypeBusinessUnitRoutingModule
  ]
})
export class FleetTypeBusinessUnitModule { }
