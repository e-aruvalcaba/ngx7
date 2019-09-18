import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountrySettingsRoutingModule } from './country-settings-routing.module';
import { CountrySettingsComponent } from './country-settings.component';

@NgModule({
  declarations: [CountrySettingsComponent],
  imports: [
    CommonModule,
    CountrySettingsRoutingModule
  ]
})
export class CountrySettingsModule { }
