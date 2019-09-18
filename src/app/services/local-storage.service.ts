//  Imports
//    Core
import { Injectable } from '@angular/core';

/**
 * Local storage handler
 */
@Injectable({
  providedIn: "root"
})

export class LocalStorageService {

  /**
   * Creates an instance of LocalStorageService
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
      console.warn(`String cannot be converted to JSON ${str}`);
      return null;
    } // end try catch
  } // end JSON.tryParse

  /**
   * Gets an item from local storage
   * @param itemKey 
   */
  get (itemKey: string): any {

    if (typeof itemKey == "undefined") {
      return localStorage;
    } // end if itemKey undefined

    //  If not exists
    if (localStorage.getItem(itemKey) === null) {
      console.warn("Item " + itemKey + " do not exists");
      return null;
    } // end if item do not exists

    let itemValue = localStorage.getItem(itemKey);
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
    localStorage.setItem(itemKey, itemValue);
  } // end set function

  /**
   * Returns true if the key exists in local storage
   * 
   * @param itemKey The item key to look for
   */
  exists (itemKey): boolean {
    return window.localStorage.getItem(itemKey) !== null;
  } // end function exists

  /**
   * Removes an item in local storage
   */
  remove = function(itemKey) {
    localStorage.removeItem(itemKey);
  } // end function remove
} // end export class LocalStorageService