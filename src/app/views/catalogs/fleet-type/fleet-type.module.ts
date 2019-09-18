import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypeRoutingModule } from './fleet-type-routing.module';
import { FleetTypeComponent } from './fleet-type.component';

@NgModule({
  declarations: [FleetTypeComponent],
  imports: [
    CommonModule,
    FleetTypeRoutingModule
  ]
})
export class FleetTypeModule { }
