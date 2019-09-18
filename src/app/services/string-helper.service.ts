import { Injectable } from '@angular/core';

@Injectable({
  providedIn:"root"
})
export class StringHelperService {

  /**
   * Creates an instance of StringHelperService
   */
  constructor() {
  } // end constructor function

  /**
   * Function to encode an object into a url string
   *
   * @param data The object to encode
   */
  encodeUrl(data: Object): string {
    let str = [];
    for(var p in data)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
    return str.join("&");
  } // end function encodeUrl

  /**
   * Return left part of str
   *
   * @param str The string to get the left part
   * @param n The number of characters
   */
  left(str, n): string {
    if (n <= 0) {
      return "";
    } else if (n > str.length) {
      return str;
    } else {
      return str.substring(0, n);
    } // end if then else n <= 0
  }; // end function right

  /**
   * Return right part of str
   *
   * @param str The string to get the right part
   * @param n The number of characters
   */
  right(str, n): string {
    if (n <= 0) {
      return "";
    } else if (n > str.length) {
      return str;
    } else {
      let iLen = str.length;
      return str.substring(iLen, iLen - n);
    } // end if then else n <= 0
  }; // end function right

  /**
   * Formats the date
   *
   * @param date The date to format
   */
  formatDate(date: Date, format = "yyyy-MM-dd"): string {
    let month = date.getMonth() + 1; //months from 1-12
    let day = date.getDate();
    let year = date.getFullYear();

    let strYear = String(year);
    let strMonth = "00" + month;
    let strDay = "00" + day;
    strMonth = this.right(strMonth, 2);
    strDay = this.right(strDay, 2);

    let d = "";

    switch (format) {
      case ("yyyy-MM-dd"):
        d = `${strYear}-${strMonth}-${strDay}`;
      break;
      case ("yyyy/MM/dd"):
        d = `${strYear}/${strMonth}/${strDay}`;
      break;
    } // end switch

    return d;
  } // end function formatDate

  /**
   * Return a accentless string
   *
   * @param value string The string to replace accents to
   */
  stripAccents(value: string): string {
    value = value.replace("á", "a");
    value = value.replace("é", "e");
    value = value.replace("í", "i");
    value = value.replace("ó", "o");
    value = value.replace("ú", "u");
    return value;
  } // end function stripAccents
} // end class StringHelperService