import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICmxCalendarMonth } from '../../../models/cmx-calendar-month.interface';
import { ICmxCalendarDay } from '../../../models/cmx-calendar-day.interface';
import { ICmxCalendarWeekDay } from '../../../models/cmx-calendar-weekday.interface';


@Component({
  selector: 'cmx-calendar-month',
  templateUrl: './cmx-calendar-month.component.html',
  styleUrls: ['./cmx-calendar-month.component.scss']
})
export class CmxCalendarMonthComponent {
  //  Receives a calendar month
  @Input()
  month: ICmxCalendarMonth;

  //  Stores the weekdays
  @Input()
  weekDays: ICmxCalendarWeekDay[];

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
