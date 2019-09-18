//  Imports
//    Core
import { Injectable } from '@angular/core';

/**
 * Local storage handler
 */
@Injectable({
  providedIn:"root"
})
export class SessionStorageService {

  /**
   * Creates an instance of SessionStorageService
   */
  constructor() { }

  /**
   * Tries to parse a string into JSON
   * @param str The string to try to parse to JSON format
   */
  private tryParseJSON (str): boolean {
    try {
      return JSON.parse(str);
    } catch (ex) {
      return null;
    } // end try catch
  } // end JSON.tryParse

  /**
   * Gets an item from local storage
   * @param itemKey 
   */
  get (itemKey: string): any {

    if (typeof itemKey == "undefined") {
      return sessionStorage;
    } // end if itemKey undefined

    //  If not exists
    if (sessionStorage.getItem(itemKey) === null) {
      console.warn("Item " + itemKey + " do not exists");
      return null;
    } // end if item do not exists

    let itemValue = sessionStorage.getItem(itemKey);
    let output = this.tryParseJSON(itemValue);
    if (output) {
      return output;
    } else {
      return itemValue;
    } // end if then else JSON.tryParse output
  } // end get function

  /**
   * Stores an item in local storage
   * 
   * @param itemKey The item key to store
   * @param itemValue The item value to store
   */
  set (itemKey: string, itemValue: any): void {
    if (typeof itemValue == "object") {
      itemValue = JSON.stringify(itemValue);
    } // end if itemValue object
    sessionStorage.setItem(itemKey, itemValue);
  } // end set function

  /**
   * Returns true if the key exists in local storage
   * 
   * @param itemKey The item key to look for
   */
  exists (itemKey): boolean {
    return window.sessionStorage.getItem(itemKey) !== null;
  } // end function exists

  /**
   * Removes an item in local storage
   */
  remove = function(itemKey) {
    sessionStorage.removeItem(itemKey);
  } // end function remove
} // end export class sessionStorageService