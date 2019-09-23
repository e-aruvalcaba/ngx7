import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lazySharedConfig } from '../../../lazyshared.module';
import { sharedConfig } from 'src/app/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCalendarComponent } from './cmx-calendar.component';
import { CmxCalendarDayModule } from '../cmx-calendar-day/cmx-calendar-day.module';
import { CmxCalendarMonthModule } from '../cmx-calendar-month/cmx-calendar-month.module';
import { CmxCalendarWeekModule } from '../cmx-calendar-week/cmx-calendar-week.module';

@NgModule({
  declarations: [CmxCalendarComponent],
  providers: [sharedConfig.providers],
  exports:[CmxCalendarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CmxCalendarDayModule,
    CmxCalendarWeekModule,
    CmxCalendarMonthModule
  ]
})
export class CmxCalendarModule { }
