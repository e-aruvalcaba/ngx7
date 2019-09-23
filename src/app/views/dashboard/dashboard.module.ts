import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { lazySharedConfig } from '.././../lazyshared.module';

@NgModule({
  declarations: [DashboardComponent],
  providers:[lazySharedConfig.providers],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    lazySharedConfig.imports
  ]
})
export class DashboardModule { }
