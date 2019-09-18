import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICmxCalendarWeek } from '../../../models/cmx-calendar-week.interface';
import { ICmxCalendarDay } from '../../../models/cmx-calendar-day.interface';

@Component({
  selector: 'cmx-calendar-week',
  templateUrl: './cmx-calendar-week.component.html',
  styleUrls: ['./cmx-calendar-week.component.scss']
})
export class CmxCalendarWeekComponent {

  //  Receives a set of days
  @Input()
  week: ICmxCalendarWeek;

  //  Emmit the calendar date
  @Output()
  onSelectedDay: EventEmitter<ICmxCalendarDay> = new EventEmitter<ICmxCalendarDay>();

  /**
   * Emits the calendar day to a subscriber
   */
  selectDay(calendarDay: ICmxCalendarDay): void {
    this.onSelectedDay.emit(calendarDay);
  } // end function selectDay

}
