import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedConfig } from 'src/app/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCalendarWeekComponent } from '../cmx-calendar-week/cmx-calendar-week.component';
import { CmxCalendarDayModule } from '../cmx-calendar-day/cmx-calendar-day.module';


@NgModule({
  declarations: [CmxCalendarWeekComponent],
  exports:[CmxCalendarWeekComponent],
  providers: [sharedConfig.providers],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CmxCalendarDayModule
  ]
})
export class CmxCalendarWeekModule { }
