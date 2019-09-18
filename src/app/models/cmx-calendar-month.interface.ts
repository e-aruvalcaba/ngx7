import { ICmxCalendarWeek } from './cmx-calendar-week.interface';

/**
 * Represents a calendar month
 */
export interface ICmxCalendarMonth {
  number: number;
  name: string;
  year: number;
  weeks: ICmxCalendarWeek[];
} // end interface ICmxCalendarMonth
