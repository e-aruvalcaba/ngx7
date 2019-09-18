import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequencyRoutingModule } from './frequency-routing.module';
import { FrequencyComponent } from './frequency.component';

@NgModule({
  declarations: [FrequencyComponent],
  imports: [
    CommonModule,
    FrequencyRoutingModule
  ]
})
export class FrequencyModule { }
