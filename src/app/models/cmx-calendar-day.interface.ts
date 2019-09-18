/**
 * Represents a calendar day
 */
export interface ICmxCalendarDay {
  dayNumber: number;
  date: Date;
  weekDay: number;
  weekDayName: string;
  isWorkingDay: boolean;
  isSelected: boolean;
}
