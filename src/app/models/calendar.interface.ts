import { ICalendarException } from './calendar-exception.interface';

export interface ICalendar {
  calendarId?: number;
  calendarDesc: string;
  countryCode: string;
  countryDesc?: string;
  workingDaysCode: number;
  isDefault: boolean;
  exceptions: ICalendarException[];
  changeDateTime?: Date;
  userAccountChange?: string;
  creationDateTime?: Date;
  userAccountCreation?: string;
}
