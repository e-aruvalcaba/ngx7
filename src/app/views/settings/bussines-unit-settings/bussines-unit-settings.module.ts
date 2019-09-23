import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BussinesUnitSettingsRoutingModule } from './bussines-unit-settings-routing.module';
import { BussinesUnitSettingsComponent } from './bussines-unit-settings.component';
import { lazySettingsSharedConfig } from '../../../lazyshared.module';
import { sharedConfig } from 'src/app/shared.module';


@NgModule({
  declarations: [BussinesUnitSettingsComponent],
  providers: [sharedConfig.providers, ],
  imports: [
    CommonModule,
    BussinesUnitSettingsRoutingModule,
    lazySettingsSharedConfig.imports
  ]
})
export class BussinesUnitSettingsModule { }
