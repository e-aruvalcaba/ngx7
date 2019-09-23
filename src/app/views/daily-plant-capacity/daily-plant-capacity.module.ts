import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyPlantCapacityRoutingModule } from './daily-plant-capacity-routing.module';
import { DailyPlantCapacityComponent } from './daily-plant-capacity.component';
import { lazySharedConfig } from '.././../lazyshared.module';
import { sharedConfig } from 'src/app/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxDropdownModule } from '@cemex/cmx-dropdown-v4';
import { CmxDatepickerModule } from '@cemex/cmx-datepicker-v4';
import { CmxChartModule } from '@cemex/cmx-chart-v1';
import { CmxDialogModule } from '@cemex/cmx-dialog-v7';
import { DashPanelComponent } from '../daily-plant-capacity/dash-panel/dash-panel.component';

@NgModule({
  declarations: [DailyPlantCapacityComponent, DashPanelComponent],
  providers: [sharedConfig.providers],
  imports: [
    CommonModule,
    DailyPlantCapacityRoutingModule,
    FlexLayoutModule,
    CmxDropdownModule,
    CmxDatepickerModule,
    CmxChartModule,
    CmxDialogModule,
  ]
})
export class DailyPlantCapacityModule { }
