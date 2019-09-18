import { ICmxCalendarMonth } from './cmx-calendar-month.interface';
import { CmxWeekDays } from './cmx-weekdays.enum';
import { ICmxCalendarWeekDay } from './cmx-calendar-weekday.interface';

/**
 * Representa a calendar
 */
export interface ICmxCalendar {
  year: number;
  weekStartsAt: CmxWeekDays;
  months: ICmxCalendarMonth[];
  weekDays: ICmxCalendarWeekDay[];
} // end export interface
