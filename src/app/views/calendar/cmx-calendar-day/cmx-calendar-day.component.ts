import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ICmxCalendarDay } from 'src/app/models/cmx-calendar-day.interface';

@Component({
  selector: 'cmx-calendar-day',
  templateUrl: './cmx-calendar-day.component.html',
  styleUrls: ['./cmx-calendar-day.component.scss']
})
export class CmxCalendarDayComponent{

   //  Receives the calendar day
   @Input()
   calendarDay: ICmxCalendarDay;
 
   //  Emmit the calendar date
   @Output()
   onSelectedDay: EventEmitter<ICmxCalendarDay> = new EventEmitter<ICmxCalendarDay>();
 
   /**
    * Emits the calendar day to a subscriber
    */
   selectDay(): void {
     this.onSelectedDay.emit(this.calendarDay);
   } // end function selectDay
}
