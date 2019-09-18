import { Injectable } from '@angular/core';
import { ICmxCalendarWeekDay } from '../models/cmx-calendar-weekday.interface';
import { CmxWeekDays } from '../models/cmx-weekdays.enum';
import { CmxBitwiseWeekDays } from '../models/cmx-bitwise-weekdays.enum';

/**
 * Provider with calendar functions
 */
@Injectable({
  providedIn: "root"
})

export class CmxCalendarService {

  //  Stores the cmxLanguages
  private cmxLanguages: any[];

  //  Store the current cmxLanguage
  private cmxLanguage: any;

  /**
   * Creates an instance of CmxCalendarService
   */
  constructor() {
    //  Get the languages
    this.cmxLanguages = window['CMX_LANGUAGES'];
    let languageISO = sessionStorage.getItem('language');
    if (languageISO) {
      let lang = this.cmxLanguages.filter(l => l.languageISO == languageISO)[0];
      if (!lang) {
        console.warn(`Language ${languageISO} is not present in CMX_LANGUAGES`);
        this.cmxLanguage = this.cmxLanguages[0];
        return;
      } // end if not lang

      this.cmxLanguage = lang;
    } else {
      console.warn('Language not present in SessionStorage');
      this.cmxLanguage = this.cmxLanguages[0];
    } // end if then else language ISO
  } // end function constructor

  /**
   * Adjust the week day number to the position relative to the start at
   * @param startAt
   * @param index
   */
  private adjustWeekDayNumber(weekStartAt: number, index: number): number {
    if (weekStartAt > index) {
      return 7 - index;
    } else {
      return index + 1;
    } // end if then else startAt compare
  } // end function adjustWeekDayNumber

  /**
   * Returns a list with the month names
   */
  public getMonthNames(): string[] {

    //  Set the month names
    let monthNames: string[] = this.cmxLanguage.monthNames.split(',');

    return monthNames;
  } // end function getMonthNames

  /**
   * Returns a list with the week days
   */
  public getWeekDays(weekStartAt: CmxWeekDays): ICmxCalendarWeekDay[] {

    //  Set the week days
    //    Get the day names
    let dayNames: string[] = this.cmxLanguage.dayNames.split(',');

    //  Initialize in null
    let weekDays: ICmxCalendarWeekDay[] = [null, null, null, null, null, null, null];

    //  Loop the daynames
    for (let index in dayNames) {
      //  Adjust the day number (1 - 7)
      let dayNumber: number = this.adjustWeekDayNumber(Number(CmxWeekDays[weekStartAt]), Number(index));

      //  Setup the week day in the righ slot (1-7)
      weekDays[dayNumber - 1] = {
        number: dayNumber,
        initial: dayNames[index].substr(0,1),
        shortName: dayNames[index].substr(0,2),
        name: dayNames[index],
        isSelected: false,
        bitWiseValue: Number(CmxBitwiseWeekDays[dayNames[index]])
      }; // end week day push
    } // end for each index

    return weekDays;
  } // end function getWeekDays

  /**
   * Calculates the bitwisevalue
   * @param weekDays ICmxCalendarWeekDay[]
   */
  public calculateBitwiseValue(weekDays: ICmxCalendarWeekDay[]) {
    return weekDays.filter(
      wd => wd.isSelected
    ).map(
      wd => wd.bitWiseValue
    ).reduce(
      (acc, current) => acc + current, 0
    ); // end filter map reduce
  } // end function calculateBitwiseValue
} // end class CmxCalendarService
