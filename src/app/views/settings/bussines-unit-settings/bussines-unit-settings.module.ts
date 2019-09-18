import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BussinesUnitSettingsRoutingModule } from './bussines-unit-settings-routing.module';
import { BussinesUnitSettingsComponent } from './bussines-unit-settings.component';

@NgModule({
  declarations: [BussinesUnitSettingsComponent],
  imports: [
    CommonModule,
    BussinesUnitSettingsRoutingModule
  ]
})
export class BussinesUnitSettingsModule { }
