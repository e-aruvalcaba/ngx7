import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedConfig } from 'src/app/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCalendarDayComponent } from '../cmx-calendar-day/cmx-calendar-day.component';

@NgModule({
  declarations: [CmxCalendarDayComponent],
  exports:[CmxCalendarDayComponent],
  providers: [sharedConfig.providers],
  imports: [
    CommonModule,
    FlexLayoutModule
  ]
})
export class CmxCalendarDayModule { }
