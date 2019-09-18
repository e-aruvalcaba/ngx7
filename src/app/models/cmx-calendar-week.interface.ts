import { ICmxCalendarDay } from './cmx-calendar-day.interface';

//  Represents a calendar week
export interface ICmxCalendarWeek {
  number: number;
  month: number;
  calendarDays: ICmxCalendarDay[];
} // end export interface
