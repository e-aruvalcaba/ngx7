import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedConfig } from 'src/app/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCalendarMonthComponent } from '../cmx-calendar-month/cmx-calendar-month.component';
import { CmxCalendarWeekModule } from '../cmx-calendar-week/cmx-calendar-week.module';

@NgModule({
  declarations: [CmxCalendarMonthComponent],
  exports:[CmxCalendarMonthComponent],
  providers: [sharedConfig.providers],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CmxCalendarWeekModule
  ]
})
export class CmxCalendarMonthModule { }
