import { Injectable, isDevMode } from '@angular/core';
import { v1_countries } from '../data/v1-countries';
import { FLEET_COUNTRIES } from '../data/fleet-countries';
import { AMERICAS_COUNTRIES } from '../data/americas-countries';

@Injectable({
  providedIn: 'root'
})

export class VersionToggle {

  private _isNormalized = false;

  public isSettingsEnabled(): boolean {
    var currentCountry: string = sessionStorage.getItem("country");

    if (v1_countries.findIndex(count => String(count).toUpperCase() == currentCountry.toUpperCase()) == -1) {
      // is v2
      return true;
    }
    // is v1
    return false;
  } // end function isSettingsEnabled

  public isFleetEnabled(): boolean {
    return (FLEET_COUNTRIES.findIndex(c => String(c).toUpperCase() == String(sessionStorage.getItem("country")).toUpperCase()) > -1)
  } // end function is FleetEnabled

  /**
   * Returns the number of version, 1 or 2, depending on the country
   */
  public getVersion(): number {
    return (this.isSettingsEnabled()) ? 2 : 1;
  } // end function getVersion

  /**
   * Sets is normalized value
   *
   * @param isNormalized The boolean value, true if normalized.
   *
   * @return void
   */
  public setIsNormalized(isNormalized: boolean): void {
    this._isNormalized = isNormalized;
  } // end function setIsNormalized

  /**
   * Indicates if the version is normalized
   *
   * @return boolean
   */
  public isNormalized(): boolean {
    return this._isNormalized;
  } // end isNormalized

  /**
   * Returns envcode (DEV, QA, PROD, etc.)
   *
   * @return string
   */
  public getEnvironment(): string {
    let apiHost = window["API_HOST"];
    let env = "dev";

    switch (apiHost) {
      case "https://cemexqas.azure-api.net/":
        env = "qa";
      break;
      case "https://uscldcnxapmd01.azure-api.net/":
        env = "dev";
      break;
      case "https://uscldcnxapmsa01.azure-api.net/":
        env = "dev2";
      break;
      case "https://pp.cemexgo.com/api/":
        env = "pre";
      break;
      case "https://www.cemexgo.com/api/":
        env = "prod";
      break;
      // case "http://localhost:5000/": //Modified to new localhost port on angular7
      case "http://localhost:4200/":
        env = "local";
      break;
      case "https://qa2.cemexgo.com/api/":
        env = "qa2";
      break;
      default: "dev";
    } // end swith apiHost
    return env;
  } // end function getEnvironment

  public getDataCenter(): string {
    var currentCountry = sessionStorage.getItem("country");

    if (AMERICAS_COUNTRIES.findIndex(count => String(count).toUpperCase() == String(currentCountry).toUpperCase()) == -1) {
      // is uk
      return 'uk';
    }
    // is us
    return 'us';
  } // end function isSettingsEnabled

} // end class VersionToggle
