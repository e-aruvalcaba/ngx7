import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoAccessRoutingModule } from './no-access-routing.module';
import { NoAccessComponent } from './no-access.component';

@NgModule({
  declarations: [NoAccessComponent],
  imports: [
    CommonModule,
    NoAccessRoutingModule
  ]
})
export class NoAccessModule { }
