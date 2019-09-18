import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ICmxCalendarDay } from '../../../models/cmx-calendar-day.interface';
import { ICmxCalendarWeek } from '../../../models/cmx-calendar-week.interface';
import { ICmxCalendarMonth } from '../../../models/cmx-calendar-month.interface';
import { CmxWeekDays } from '../../../models/cmx-weekdays.enum';
import { ICmxWeekDay } from '../../../models/cmx-weekday.interface';
import { CmxBitwiseWeekDays } from '../../../models/cmx-bitwise-weekdays.enum';
import { ICmxCalendarWeekDay } from '../../../models/cmx-calendar-weekday.interface';
import { CmxCalendarService } from '../../../services/cmx-calendar.service';


@Component({
  selector: 'cmx-calendar',
  templateUrl: './cmx-calendar.component.html',
  styleUrls: ['./cmx-calendar.component.scss']
})
export class CmxCalendarComponent implements OnChanges {

  /**
   * Creates an instance of CmxCalendarComponent
   */
  constructor(private calendarService: CmxCalendarService) { }

  @Input()
  get year(): number {
    return this._year;
  } // end function get year
  set year(val: number) {
    this._year = val;
    this.setCalendar();
  } // end function set year

  @Input()
  get weekStartAt(): CmxWeekDays {
    return this._weekStartAt;
  } // end function weekStartAt
  set weekStartAt(val: CmxWeekDays) {
    this._weekStartAt = val;
    this.setCalendar();
  } // end function week start at

  @Input()
  get locale(): string {
    return this._locale;
  } // end function get locale
  set locale(val: string) {
    this._locale = val;
    this.setCalendar();
  } // end function set local

  @Input()
  get workingWeekDays(): number[] {
    return this._workingWeekDays;
  } // end function get working days
  set workingWeekDays(val: number[]) {
    this._workingWeekDays = val;
    this.setCalendar();
  } // end function workingDays

  //  A list of non-working days
  @Input()
  get nonWorkingDates(): Date[] {
    return this._nonWorkingDates;
  } // end function not working days
  set nonWorkingDates(val: Date[]) {
    this._nonWorkingDates = val;
    this.setCalendar();
  } // end function not working day

  @Input()
  monthWidth: number;

  //  Emmit the calendar date
  @Output()
  public onSelectedDay: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  //  Stores the locale
  private _locale: string;

  //  Stores the year
  private _year: number;

  //  Stores the week start at day
  private _weekStartAt: CmxWeekDays;

  //  Stores the working week days
  private _workingWeekDays: number[];

  //  Stores the non-working dates
  private _nonWorkingDates: Date[];

  //  Stores the months
  private months: ICmxCalendarMonth[] = [];

  //  Stores the weekdays
  private weekDays: ICmxCalendarWeekDay[];

  /**
   * Emits the calendar day to a subscriber
   */
  private selectDay(calendarDay: ICmxCalendarDay): void {

    if (!this.nonWorkingDates) {
      this.nonWorkingDates = [];
      this.nonWorkingDates.push(calendarDay.date);
      this.onSelectedDay.emit(this.nonWorkingDates);
      this.setCalendar();
      return;
    } // end if not nont working dates

    if (this.nonWorkingDates.length == 0) {
      this.nonWorkingDates.push(calendarDay.date);
      this.setCalendar();
      this.onSelectedDay.emit(this.nonWorkingDates);
      return;
    } // end if not nont working dates

    //  If in nonWorkingDates, remove it
    //  if not, include it
    let isPresent: boolean = false;
    for (let index in this.nonWorkingDates) {
      if (this.nonWorkingDates[index].getTime() == calendarDay.date.getTime()) {
        isPresent = true;
        this.nonWorkingDates.splice(Number(index), 1);
      } // end if calendarDay is in not working dates
    } // end for each non working date

    if (!isPresent) {
      this.nonWorkingDates.push(calendarDay.date);
    } // end if not is present

    this.setCalendar();
    this.onSelectedDay.emit(this.nonWorkingDates);
  } // end function selectDay

  /**
   * Sets the nonWorking dates
   */
  private setNonWorkingDates(): void {
    if (!this.nonWorkingDates) {
      return;
    } // end if not not working dates

    let pleaseBreakWeekToo: boolean = false;

    //  For each date
    for (let date of this.nonWorkingDates) {
      //  Get the month
      let month: ICmxCalendarMonth = this.months.filter(m => m.number == date.getMonth() + 1)[0];
      for (let weekIndex in month.weeks) {
        //  Set the break for week to false
        pleaseBreakWeekToo = false;
        //  Loop days
        for (let cdIndex in month.weeks[weekIndex].calendarDays) {
          //  If it's the same date
          if (
            (month.weeks[weekIndex].calendarDays[cdIndex]) &&
            (date.getTime() == month.weeks[weekIndex].calendarDays[cdIndex].date.getTime())
          ) {
            //  Select the day
            month.weeks[weekIndex].calendarDays[cdIndex].isSelected = true;
            //  Set to break week
            pleaseBreakWeekToo = true;
            //  Break
            break;
          } // end if date is the same
        } // end for each day

        if (pleaseBreakWeekToo) {
          break;
        } // end if please break week too
      } // end for each weekIndex
    } // end for each date
  } // end function setNonWorkingDates

  /**
   * Returns true if it's working day
   *
   * @param weekDay string
   * @param date Date
   *
   */
  private isWorkingDay(weekDay: string, date: Date) {

    //  Stores the result
    let result: boolean = false;

    if ((this.workingWeekDays)) {
      for (let wday of this.workingWeekDays) {
        let wd = this.weekDays.filter(d => d.name == weekDay)[0];
        if (!wd) {
          console.warn(`Weekday ${weekDay} does not in cmx week days`);
          break;
        } // end if

        if (wday == wd.number) {
          result = true;
          break;
        } // end if weekDay == any workingday
      } // end for each working week days
    } // end if there are workingWeekDays

    if ((this.nonWorkingDates)) {
      for (let d of this.nonWorkingDates) {
        if (d == date && result) {
          result = false;
          break;
        } // end if date is non working date and working day
      } // end for each non working dates
    } // end if non working dates

    return result;
  } // end function isWorkingDay

  /**
   * Returns true if it's non working date
   *
   * @param date Date
   */
  private isNonWorkingDate(date: Date) {
    let result: boolean = false;

    if ((this.nonWorkingDates)) {
      for (let d of this.nonWorkingDates) {
        if (d.getTime() == date.getTime()) {
          result = true;
          break;
        } // end if date is non working date and working day
      } // end for each non working dates
    } // end if nonWorkingDates

    //  Return the result
    return result;
  } // end function isNonWorkingDate
  /**
   * Sets the calendar from the year and week start at
   */
  private setCalendar() {

    if ((!this.year) || !(this.weekStartAt) || !(this.locale)) {
      console.warn("Calendar presiquisites not ready yet.");
      return;
    } // end validate

    //  Set the months
    this.months = [];

    //  Set the month names
    let monthNames: string[] = this.calendarService.getMonthNames();
    //  Set the week days
    //  Initialize in null
    this.weekDays = this.calendarService.getWeekDays(this.weekStartAt);

    //  Setup a new date, startins Jan 1
    let date = new Date(this.year, 0, 1);

    //  Set the month
    let month: ICmxCalendarMonth = {
      number: date.getMonth() + 1,
      name: monthNames[date.getMonth()],
      year: this.year,
      weeks: []
    }; // end month

    //  Set the week
    let week: ICmxCalendarWeek = {
      number: 1,
      month: month.number,
      calendarDays: [null, null, null, null, null, null, null]
    }; // end week

    //  Holds the previous weekday, start in 0
    let previousWeekDay: number = 0;

    //  Here we construct the year
    //  Loopt throgh the year dates
    while (date.getFullYear() == this.year) {

      //  Get the locale day name
      let localeDayName = date.toLocaleDateString(this.locale, { weekday: 'long' });
      //  Get the weekday number
      let weekDay: number = CmxWeekDays[localeDayName];
      //  new week, if we reach seven days
      if (weekDay == 1 && previousWeekDay == 7) {
        //  Add week to month
        month.weeks.push(week);
        //  Set new week
        week = {
          number: week.number + 1,
          month: month.number,
          calendarDays: [null, null, null, null, null, null, null]
        }; // end week
      } // end if weekDay

      //  new month, if we reach new month number
      if (month.number < date.getMonth() + 1) {

        //  Add week to month
        month.weeks.push(week);
        this.months.push(month);

        month = {
          number: date.getMonth() + 1,
          name: monthNames[date.getMonth()],
          year: this.year,
          weeks: []
        }; // end month

        //  Set new week
        week = {
          number: 1,
          month: month.number,
          calendarDays: [null, null, null, null, null, null, null]
        }; // end week
      } // end if new month

      let weekDayName: string = this.weekDays.filter(wd => wd.number == weekDay)[0].name;

      //  Set the calendar day
      //  Add the day in his week slot
      week.calendarDays[weekDay - 1] = {
        dayNumber: date.getDate(),
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        weekDay,
        weekDayName,
        isWorkingDay: this.isWorkingDay(weekDayName, date),
        isSelected: this.isNonWorkingDate(date)
      }; // end calendarDay

      //  Increments one day
      date.setDate(date.getDate() + 1);
      previousWeekDay = weekDay;
    } // end while same year

    //  Add week to month
    month.weeks.push(week);
    this.months.push(month);
  } // end function setYear

  /**
   * Detects changes
   */
  ngOnChanges(changes: SimpleChanges) {
  } // end ngOnChanges
}
