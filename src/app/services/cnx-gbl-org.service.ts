//  Injectable core
import { IBucket, IBucketDetail, IUpdateBucket, IUpdateBucketDetail, IClone } from '../models/v3/oe/interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; //New import for observable objects
// import { map } from 'rxjs/operators';
import { of } from 'rxjs';
// import {  catchError as _catch } from 'rxjs/operators' ;
import 'rxjs/add/operator/catch'; //New import for catch
import 'rxjs/add/operator/map'; //New import for map

// import { _catch } from 'rxjs/operator/catch';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { Subject } from 'rxjs';

//  Other services
import { SessionStorageService } from './session-storage.service';
import { StringHelperService } from './string-helper.service';
// import { TranslationService } from '@cemex-core/angular-localization-v1/dist';
import { TranslationService } from '@cemex-core/angular-localization-v7';
import { VersionToggle } from './versionToggle.service';

//  The models
import { Plant } from '../models/plant';
import { ProductType } from '../models/product-type';
import { ProductTypeGroup } from '../models/product-type-group';
import { CapacityItem } from '../models/capacity-item';
import { Bucket } from '../models/bucket';
import { BucketDetail } from '../models/bucket-detail';
import { CapacityCheckItem } from '../models/capacity-check-item';
import { MaterialType } from '../models/material-type';
import { Material } from '../models/material';
import { IMaterial } from '../models/material.interface';
import { IUpdateCapacityItemsResponse } from '../models/iupdate-capacity-items-response';
import { ICapacityItemsResponse } from '../models/icapacity-items-response';
import { ICloneCapacityItemsResponse } from '../models/iclone-capacity-items-response';
import { CapacityDistributionItem } from '../models/capacity-distribution-item';
import { IDailyPlantCapacityItem } from '../models/daily-plant-capacity-item.interface';
import { ICapacity } from '../models/capacity.interface';
import { ICustomerTypeCapacity } from '../models/customer-type-capacity.interface';
import { ICapacityInquiryItem } from '../models/capacity-inquiry-item.interface';
import { ISeriesItem } from '../models/series-item.interface';
import { IHourlySeriesItem } from '../models/hourly-series-item.interface';
import { FleetType } from '../models/fleet-type'
import { FleetCoverage } from '../models/fleet-coverage'
import { FleetTypeBusinessUnit } from '../models/fleet-type-bu'
import { FleetCapacityItem } from '../models/fleet-capacity-item';
import { ICloneFleetCapacityItemsResponse } from '../models/clone-fleet-capacity-items-response.interface';
import { ICommercialManagement } from '../models/commercial-management.interface';
import { ICustomer } from '../models/customer.interface';
import { ICapacityReport } from '../models/capacity-report.interface';
import { IFleetCapacityReportItem } from '../models/fleet-capacity-report-item.interface';
import { ICalendarListItem } from '../models/calendar-list-item.interface';
import { IBusinessUnitSettings, ConfiguredPlants } from '../models/business-unit-settings.interface';
import { IBusinessUnitSettingsItem } from '../models/business-unit-settings-item.interface';
import { ICalendar } from '../models/calendar.interface';
import { IBusinessUnitSettingsData } from '../models/business-unit-settings-data.interface';
import { IBusinessUnitSettingsUpdateItem } from '../models/business-unit-settings-update-item.interface';
import { ICountrySettings, IMaterialTypes, IApplicationClients, IDeliveryWindows, IGeolocationServices, IDigitalConfirmationProcesses, IProductTypes, IShippingTypes, IShippingConditions, ShippingCondition } from '../models/country-settings.interface';

//  Constants
import { HOURS } from '../data/hours';
import { BUSINESS_UNIT_SETTINGS } from '../data/business-unit-settings';
import { CUSTOMER_TYPES } from '../data/customer-types';
import { PRODUCT_TYPES } from '../data/product-types';
import { API_ENDPOINTS } from '../data/api-endpoints';
import { ENDPOINTS } from '../data/endpoints';
import { SHIPPING_CONDITIONS } from '../data/shipping-conditions';

// import { observableToBeFn } from 'rxjs'; //Doesn't exists on current rxjs release
import { Product } from '../models/product';
import { Country } from '../models/Country';
import { Holiday } from '../models/Holiday';

import * as moment from 'moment';
import { ComboMonth } from '../models/Month';
import { UnlockTime } from '../models/unlock-time';
import { BusinessLine } from '../models/business-line';

//    BaseUrl
const baseUrl = (window['API_HOST_FULL'].endsWith("/")) ? window['API_HOST_FULL'].slice(0, -1) : window['API_HOST_FULL'];
const settingsUrl = baseUrl;
const imUrl = baseUrl;

//    ClientID
const clientId = window['CLIENT_ID'];

// AppCode
const appcode = window['APP_CODE'];


//    Default Http options
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Service for communication with cnx-gbl-org API
 */
@Injectable({
  providedIn: "root"
})

export class CnxGblOrgService {

  /**
   * Creates an instance of CnxGblOrgService
   *
   * @param authHttp The http to use for authentication
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private session: SessionStorageService,
    private stringHelper: StringHelperService,
    private ts: TranslationService,
    private versionToggle: VersionToggle
  ) { }

  //  To pass data between components
  public dataStorage: any;

  //  Properties
  //    authData
  authData: Object;
  //    waiting subject
  waitingSubject = new Subject<boolean>();
  //    authenticated subject
  authSubject = new Subject<boolean>();
  //    DailyPlantCapacityItems
  dailyPlantCapacityItemsSubject = new Subject<ICapacityInquiryItem[]>();
  customerTypeCapacityItemsSubject = new Subject<ICustomerTypeCapacity[]>();

  //    The hours
  hours = HOURS;

  /**
   * Returns translation
   *
   * @param key The key to look for in the locales files
   *
   * @return string
   */
  private translate(key: string): string {
    return this.ts.pt(key);
  } // end function translate

  //  Private function
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // debugger;
      console.error(error);

      let message = "";
      if (error.error instanceof ErrorEvent) {

        if (error.error.message) {
          message = error.error.message;
        } else if (error.error.moreInformation) {
          let info: any = JSON.parse(error.error.moreInformation);

          if (info.code == 53003 && info.data) {
            info.data = JSON.parse(info.data);
            message = `${this.translate('rccc.errors.commitment_dates')} ${info.data.join(',')}`;
          } // end if code 53003

          if (info.code == 53003 && info.data) {
            info.data = JSON.parse(info.data);
            message = `${this.translate('rccc.errors.commitment_dates')} ${info.data.join(',')}`;
          } // end if code 53003

        } // end if error error message
         // end if error.error.message
      } else if (error.message) {
        console.log(error.error.message);
        message = error.error.message;
      } else {
        message = error;
      }// end if error.error

      //  Stop waiting in case setup
      this.stopWaiting();

      let errorDesc = `${this.translate('rccc.service.operation_error_label')}: ${operation},
        ${this.translate('rccc.service.message_label')}: ${message}`;

      if(error.status === 401) {
        this.router.navigate(['login']);
      }

      // Validation for bad Excel template imported.
      if(error.status === 406) {
        // let translation = this.translate("digital_confirmation.error.incorrect_excel_template");
        errorDesc = error.error.message;//`${translation}`;

        // this.router.navigate(['login']);
      }

      if (error.status == 404) {
        return Observable.throw({status: error.status, message: errorDesc});
      } // end if status is 404

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return Observable.throw(errorDesc);
    } // end return observable
  } // end function handleError

  private handleErrorMoreInformation<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      let moreInformation: any = "";
      if (error.hasOwnProperty('error')) {
        if (error.error.hasOwnProperty('moreInformation')) {
          moreInformation = error.error.moreInformation;
          try {
            moreInformation = JSON.parse(moreInformation);
          } catch (ex) {
            console.warn("No parse for 'moreInformation'", moreInformation);
            moreInformation = this.translate('rccc.errors.generic_message');
          }
          return Observable.throw(moreInformation);
        } // if error.error.moreinformation
      } else if (error.hasOwnProperty('moreInformation')) {
        moreInformation = error.moreInformation;
        try {
          moreInformation = JSON.parse(moreInformation);
        } catch (ex) {
          console.warn("No parse for 'moreInformation'", moreInformation);
          moreInformation = this.translate('rccc.errors.generic_message');
        }
        return Observable.throw(moreInformation);
      } else {
        console.warn("No 'moreInformation' data in error'");
        return Observable.throw(this.translate('rccc.errors.generic_message'));
      } // if error.error
    } // end return observable
  } // end function handleErrorMoreInformation

  /**
   * Gets the waiting status
   */
  getWaitingStatus(): Observable<boolean> {
    return this.waitingSubject;
  } // end function getWaitingStatus

  /**
   * Gets the authenticated status
   */
  getAuthStatus(): Observable<boolean> {
    return this.authSubject;
  } // end function getAuthenticatedStatus

  /**
   * Return the daily plant capacity items
   */
  getDailyPlantCapacityItemsStatus(): Observable<ICapacityInquiryItem[]> {
    return this.dailyPlantCapacityItemsSubject;
  } // end function getDailyPlantCapacityItemsStatus

  /**
   * Return the daily plant capacity items
   */
  getCustomerTypeCapacityItemsStatus(): Observable<ICustomerTypeCapacity[]> {
    return this.customerTypeCapacityItemsSubject;
  } // end function getDailyPlantCapacityItemsStatus
 
  /**
   * Sets the awaiting status to true
   */
  await() {
    this.waitingSubject.next(true);
  } // end await

  /**
   * Sets the awaiting status to false
   */
  stopWaiting() {
    this.waitingSubject.next(false);
  } // end unwait

  /**
   * Initiates the application
   */
  auth() {
    if (this.session.exists('userInfo')) {
      //  Set auth to true
      this.authSubject.next(true);
      //  Get session data
      this.getSession();
      //  We've done
      return;
    } // end if

    //  Warn
    console.warn('Not logged in.');
  } // end auth

  private authOptions(): any {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
        'accept': 'application/json',
        'content-type': 'application/json',
        'Accept-Language': this.stringHelper.left(this.session.get('language'), 2),
        //'Accept-Language': 'es',
        'Authorization': `Bearer ${this.authData["oauth2"]["access_token"]}`,
        'jwt': this.authData["jwt"],
        'app-code': appcode,
      }) // end headers
    }; // end options
  } // end authOptions
  /**
   * Gets the session data from the storage
   */
  private getSession() {

    let data = this.session.get('userInfo');
    this.authData = data;
    //sessionStorage.setItem('language', 'es');
  } // end function getSession

  /**
   * Map the commercial management response
   */
  private mapCommercialManagement(response: any): ICommercialManagement[] {
    if (response["commercialManagementItems"]) {
      let result: ICommercialManagement[] = response["commercialManagementItems"];
      if ((result.length) > 0 && result[0].commercialManagementCode != "") {
        result.splice(0, 0, { commercialManagementCode: "" });
      } // end if  commercial management code of item 0 is not ""
      return result;
    } else {
      console.warn("No commercial management items retrieved");
      return null;
    } // end if
  } // end function map commercial management

  /**
   * Maps a JSON response into Plant[]
   *
   * @param response The json response to map
   */
  private mapMyPlants(response: Object) {
    if (response["plants"]) {
      let plants = response["plants"];
      plants = plants.sort(
        (row1, row2) => {
          if (row1.plantCode > row2.plantCode) {
            return 1;
          } // end if >
          if (row1.plantCode < row2.plantCode) {
            return -1;
          } // end if <
          //  The same
          return 0;
        } // end anonymous function
      ); // end sort

      plants = plants.map(
        item => {
          item.plantLabel = item.plantCode + " " + item.plantDesc; return item;
        }
      );
      return plants;
    } else {
      console.error("No plants!!");
      return null;
    } // end if plants
  } // end mapMyPlants

  /**
   * Maps a json object to a product type
   *
   * @param response The json object
   */
  private mapProductTypes(response: Object) {
    if (response["productTypes"]) {
      let productTypes = response["productTypes"];
      productTypes = productTypes.sort(
        (row1, row2) => {
          if (row1.productTypeCode > row2.productTypeCode) {
            return 1;
          } // end if >
          if (row1.productTypeCode < row2.productTypeCode) {
            return -1;
          } // end if <
          //  The same
          return 0;
        } // end anonymous function
      ); // end sort
      return productTypes;
    } else {
      console.error("No product types!!");
      return null;
    } // end if productTypes
  } // end mapProductTypes

  /**
   * Generate a series of customer distribution items detail in zeros
   *
   * @param capacityDistributionItem The capacity item to base the generation
   */
  private generateEmptyCustomerDistributionItems(capacityDistributionItem: CapacityDistributionItem): CapacityCheckItem[] {
    let result = [];

    for (let customerType of CUSTOMER_TYPES) {
      let ccItem = new CapacityDistributionItem();
      ccItem.bucketId = 0;
      ccItem.date = capacityDistributionItem.date;
      ccItem.ampm = capacityDistributionItem.ampm;
      ccItem.time = capacityDistributionItem.time;
      ccItem.hour = capacityDistributionItem.hour;
      ccItem.plantId = capacityDistributionItem.plantId;
      ccItem.materialTypeId = capacityDistributionItem.materialTypeId;
      ccItem.customerType = customerType.name;
      ccItem.tonsOffered = 0;
      ccItem.loadsOffered = 0;
      ccItem.tonsCommitted = 0;
      ccItem.loadsCommitted = 0;
      ccItem.isEditable = false;
      ccItem.canDelete = capacityDistributionItem.canDelete;
      result.push(ccItem);
    } // end for

    return result;
  } // end function generateEmpyCustomerDistributionItems

  /**
   * Maps the response from the api server into a series of CapacityDistributionItems
   *
   * @param plantId         The plant from we get the capacities
   * @param materialTypeId  The material from we get the capacities
   * @param date            The capacities date
   * @param response        The json object obtained of the api
   */
  private mapCapacityDistributionItems(plantId: number, materialTypeId: number, date: Date, response: Object) {

    if (this.versionToggle.isNormalized()) {
      return this.mapCapacityItemsV3(plantId, materialTypeId, date, response);
    } // end if is normalized

    //  Initialize
    let ccItems = [];
    let dItems = [];
    let result = [];
    let buckets = [];
    let capacityItem = new CapacityItem();
    let materialType = new MaterialType();
    let canDelete = true;

    if (response === null) {
      throw new Error(this.translate('rccc.service.no_capacity_items_found_message'));
    } // end if response

    //  Strip hours from date
    let correctedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    materialType.materialTypeId = materialTypeId;
    capacityItem.buckets = [];
    capacityItem.capacityId = 0;
    capacityItem.capacityItemDate = this.stringHelper.formatDate(correctedDate);
    capacityItem.material = new Material();
    capacityItem.material.materialType = materialType;

    if (response !== null && response["capacityItems"]) {
      let capItem = response["capacityItems"][0];
      buckets = capItem.buckets;
      capacityItem.capacityId = capItem.capacityId;
      capacityItem.material = capItem.material;
    } // end if capacityItems

    let d = new Date();
    let currentTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    let dt = new Date();
    let i = 0;
    for (i = 0; i < this.hours.length; i++) {
      let hour = this.hours[i];
      let ccItem = new CapacityDistributionItem();
      ccItem.bucketId = 0;
      ccItem.date = new Date(capacityItem.capacityItemDate + "T00:00:00");
      ccItem.ampm = hour.ampm;
      ccItem.time = hour.hms;
      ccItem.hour = hour.hour;
      ccItem.plantId = plantId;
      ccItem.materialTypeId = materialTypeId;
      ccItem.customerType = "Total";
      ccItem.tonsOffered = 0;
      ccItem.loadsOffered = 0;
      ccItem.tonsCommitted = 0;
      ccItem.loadsCommitted = 0;
      ccItem.isEditable = true;
      ccItem.canDelete = canDelete;
      dt.setTime(ccItem.date.getTime() + (hour.hour * 1000 * 60 * 60));
      if (dt <= currentTime) {
        ccItem.isEditable = false;
      } // end if hour < this component hour

      ccItem.items = this.generateEmptyCustomerDistributionItems(ccItem);
      result = buckets.filter(b => b.bucketTime == hour.hms);

      if (result.length) {
        ccItem.bucketId = result[0].bucketId;
        ccItem.tonsOffered = result[0].totalQtyOff;
        ccItem.tonsCommitted = result[0].totalQtyComm;
        ccItem.loadsOffered = result[0].totalLoadsOff;
        ccItem.loadsCommitted = result[0].totalLoadsComm;

        //  Here we map the bucket detail
        let bucketDetail = result[0].bucketDetail;
        for (let customerType of CUSTOMER_TYPES) {
          let dItem = ccItem.items.filter(item => item.customerType == customerType.name)[0];
          dItem.tonsOffered = bucketDetail[customerType.tonsOffered];
          dItem.loadsOffered = bucketDetail[customerType.loadsOffered];
          dItem.tonsCommitted = bucketDetail[customerType.tonsCommitted];
          dItem.loadsCommitted = bucketDetail[customerType.loadsCommitted];
          dItem.isEditable = (ccItem.isEditable && (ccItem.tonsOffered > 0));
        } // end for every customer type
      } // end if result length

      ccItems.push(ccItem);
    } // end for

    return <any>ccItems;
  } // end function mapCapacityDistributionItems

  /**
   * Maps a json object to a capacities objects
   *
   * @param plantId         The plant from we get the capacities
   * @param materialTypeId  The material from we get the capacities
   * @param date            The capacities date
   * @param response        The json object obtained of the api
   */
  private mapCapacityItemsV3(
    plantId: number,
    materialTypeId: number,
    date: Date,
    response: any): any {

    //  Initialize
    let ccItems = [];
    let result = [];
    let buckets: Array<IBucket> = [];
    let capacityItem = new CapacityItem();
    let materialType = new MaterialType();
    let canDelete = true;

    //  If response is null, create an empty bucket collection and return it
    if (response === null) {
      canDelete = false;
      throw new Error(this.translate('rccc.service.no_capacity_items_found_message'));
    } // end if response

    //  Strip hours from date
    let correctedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    materialType.materialTypeId = materialTypeId;
    capacityItem.buckets = [];
    capacityItem.capacityId = 0;
    capacityItem.capacityItemDate = this.stringHelper.formatDate(correctedDate);
    capacityItem.material = new Material();
    capacityItem.material.materialType = materialType;

    if (response !== null && response["buckets"]) {
      buckets = response["buckets"];
    } // end if capacityItems

    let d = new Date();
    let currentTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    let dt = new Date();
    let i = 0;
    for (i = 0; i < this.hours.length; i++) {
      let hour = this.hours[i];
      let ccItem = new CapacityDistributionItem();
      ccItem.bucketId = 0;
      ccItem.date = new Date(capacityItem.capacityItemDate + "T00:00:00");
      ccItem.ampm = hour.ampm;
      ccItem.time = hour.hms;
      ccItem.hour = hour.hour;
      ccItem.plantId = plantId;
      ccItem.materialTypeId = materialTypeId;
      ccItem.customerType = "Total";
      ccItem.tonsOffered = 0;
      ccItem.loadsOffered = 0;
      ccItem.tonsCommitted = 0;
      ccItem.loadsCommitted = 0;
      ccItem.isEditable = true;
      ccItem.canDelete = canDelete;

      dt.setTime(ccItem.date.getTime() + (hour.hour * 1000 * 60 * 60));
      if (dt <= currentTime) {
        ccItem.isEditable = false;
      } // end if hour < this component hour

      ccItem.items = this.generateEmptyCustomerDistributionItems(ccItem);
      let dateTime: string = capacityItem.capacityItemDate+"T"+hour.hms;
      result = buckets.filter(b => String(b.bucketDateTime) == String(dateTime));
      if (result.length) {
        ccItem.bucketId = result[0].bucketId;
        ccItem.tonsOffered = result[0].totalQuantityOffer;
        ccItem.tonsCommitted = result[0].totalQuantityCommitted;
        ccItem.loadsOffered = result[0].totalLoadOffer;
        ccItem.loadsCommitted = result[0].totalLoadCommitted;

        //  Here we map the bucket detail
        let bucketDetail = result[0].bucketDetail;
        let shippingConditions = this.getEnvShippingConditions();
        for (let shippingCondition of shippingConditions) {
          let dItem = ccItem.items.filter(item => item.customerType == shippingCondition.shippingConditionDesc)[0];
          dItem.isEditable = (ccItem.isEditable && (ccItem.tonsOffered > 0));
          let distributed = bucketDetail.filter(bd => bd.shippingConditionId == shippingCondition.shippingConditionId)[0];
          if (distributed) {
            dItem.bucketId = distributed.bucketDetailId;
            dItem.tonsOffered = distributed.quantityOffer;
            dItem.loadsOffered = distributed.loadOffer;
            dItem.tonsCommitted = distributed.quantityCommitted;
            dItem.loadsCommitted = distributed.loadCommitted;
          } // end if distributed
        } // end for every customer type
      } // end if result length

      ccItems.push(ccItem);
    } // end for

    return <any>ccItems;
  } // end function mapCapacityItemsV1

  /**
   * Maps a json object to a capacities objects
   *
   * @param plantId         The plant from we get the capacities
   * @param materialTypeId  The material from we get the capacities
   * @param date            The capacities date
   * @param response        The json object obtained of the api
   */
  private mapCapacityItems(plantId, materialTypeId, date, response: Object): any {

    if (this.versionToggle.isNormalized()) {
      return this.mapCapacityItemsV3(plantId, materialTypeId, date, response);
    } // end if is normalized

    //  Initialize
    let ccItems = [];
    let result = [];
    let buckets = [];
    let capacityItem = new CapacityItem();
    let materialType = new MaterialType();
    let canDelete = true;

    //  If response is null, create an empty bucket collection and return it
    if (response === null) {
      console.warn("No capacity items found, creating a new empty collection");
      canDelete = false;
    } // end if response

    //  Strip hours from date
    let correctedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    materialType.materialTypeId = materialTypeId;
    capacityItem.buckets = [];
    capacityItem.capacityId = 0;
    capacityItem.capacityItemDate = this.stringHelper.formatDate(correctedDate);
    capacityItem.material = new Material();
    capacityItem.material.materialType = materialType;

    if (response !== null && response["capacityItems"]) {
      let capItem = response["capacityItems"][0];
      buckets = capItem.buckets;
      capacityItem.capacityId = capItem.capacityId;
      capacityItem.material = capItem.material;
    } // end if capacityItems

    let d = new Date();
    let currentTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    let dt = new Date();
    let i = 0;
    for (i = 0; i < this.hours.length; i++) {
      let hour = this.hours[i];
      let ccItem = new CapacityDistributionItem();
      ccItem.bucketId = 0;
      ccItem.date = new Date(capacityItem.capacityItemDate + "T00:00:00");
      ccItem.ampm = hour.ampm;
      ccItem.time = hour.hms;
      ccItem.hour = hour.hour;
      ccItem.plantId = plantId;
      ccItem.materialTypeId = materialTypeId;
      ccItem.customerType = "Total";
      ccItem.tonsOffered = 0;
      ccItem.loadsOffered = 0;
      ccItem.tonsCommitted = 0;
      ccItem.loadsCommitted = 0;
      ccItem.isEditable = true;
      ccItem.canDelete = canDelete;

      dt.setTime(ccItem.date.getTime() + (hour.hour * 1000 * 60 * 60));
      if (dt <= currentTime) {
        ccItem.isEditable = false;
      } // end if hour < this component hour

      ccItem.items = this.generateEmptyCustomerDistributionItems(ccItem);
      result = buckets.filter(b => b.bucketTime == hour.hms);

      if (result.length) {
        ccItem.bucketId = result[0].bucketId;
        ccItem.tonsOffered = result[0].totalQtyOff;
        ccItem.tonsCommitted = result[0].totalQtyComm;
        ccItem.loadsOffered = result[0].totalLoadsOff;
        ccItem.loadsCommitted = result[0].totalLoadsComm;

        //  Here we map the bucket detail
        let bucketDetail = result[0].bucketDetail;
        for (let customerType of CUSTOMER_TYPES) {
          let dItem = ccItem.items.filter(item => item.customerType == customerType.name)[0];
          dItem.tonsOffered = bucketDetail[customerType.tonsOffered];
          dItem.loadsOffered = bucketDetail[customerType.loadsOffered];
          dItem.tonsCommitted = bucketDetail[customerType.tonsCommitted];
          dItem.loadsCommitted = bucketDetail[customerType.loadsCommitted];
          dItem.isEditable = (ccItem.isEditable && (ccItem.tonsOffered > 0));
        } // end for every customer type
      } // end if result length

      ccItems.push(ccItem);
    } // end for

    return <any>ccItems;
  } // end function mapCapacities

  /**
   * Retrives the commercial management list
   */
  getCommercialManagementItems(): Observable<ICommercialManagement[]> {

    let url = this.getEndpoint('commercialmanagementGet');
    return this.http.get<ICommercialManagement[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapCommercialManagement(response)
    )._catch(
      this.handleError('getCommercialManagement', [])
    );
  } // end function get commercial management list

  /**
   * Retrives the plants from the api
   */
  getMyPlants(): Observable<Plant[]> {
    // https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v5/dm/myplants
    return this.http.get<Plant[]>(
      `${baseUrl}/v5/dm/myplants`,
      this.authOptions()
    ).map(
      response => this.mapMyPlants(response)
    )._catch(
      this.handleError('getMyPlants', [])
    );
  } // end function getMyPlants

  /**
   * Gets product types from a plant id
   *
   * @param plantId Thep plant id to use as filter
   */
  getProductTypes(plantId: number): Observable<ProductType[]> {
    //https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/mm/producttypes?plantid=387
    return this.http.get<ProductType[]>(
      `${baseUrl}/v1/mm/producttypes?plantid=${plantId}`,
      this.authOptions()
    ).map(response => this.mapProductTypes(response))._catch(
      this.handleError('getProductTypes', null)
    ); // end http.get.map._catch
  } // end get product type

  /**
   * Get the capacity items from the api, store it in memory and returns a formated data
   *
   * @param plantId The plant to query
   * @param productTypeId The product type to query
   * @param date The date to query
   */
  getCapacityDistributionItems(
    plantId: number,
    productTypeId: number,
    date: Date,
    commercialManagementCode: string = null,
    customerId: number = null,
    materialId: number = null
  ): Observable<CapacityDistributionItem[]> {

    let url = this.getEndpoint('plantcapacitiesGet', {
        plantId,
        capacityItemDate: this.stringHelper.formatDate(date),
        productTypeId,
        materialTypeId: productTypeId
      });

    if (commercialManagementCode) {
      url += `&commercialManagementCode=${commercialManagementCode}`;
    } // end if commercialManagementCode

    if (customerId) {
      url += `&customerId=${customerId}`;
    } // end if customerId

    if (materialId) {
      url += `&materialId=${materialId}`;
    }

    //  Return the http get call
    return this.http.get<CapacityCheckItem[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapCapacityDistributionItems(plantId, productTypeId, date, response)
    )._catch(
      this.handleError('getCapacityItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function
  /**
   * Deletes a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  deleteCapacityCheckItems(
    plantId: number,
    material: IMaterial,
    customer: ICustomer = null,
    date: Date
  ): Observable<ICapacityItemsResponse> {
    // https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/oe/businessUnits/387/capacities/2018-02-07?materialTypeId=2
    //  Method delete

    //  Here construct the url
    let url = this.getEndpoint('plantcapacitiesDelete', {
      plantId,
      capacityDate: this.stringHelper.formatDate(date)
    });

    if ((material.materialType) && (material.materialType.materialTypeId)) {
      //  Here construct the url
      url = this.getEndpoint('plantcapacitiesMaterialtypeDelete', {
        plantId,
        capacityDate: this.stringHelper.formatDate(date),
        materialTypeId: material.materialType.materialTypeId,
        productTypeId: material.materialType.materialTypeId
      }); // end getEndpoint
    } // end if material type

    //  Assign material id if any
    (material.materialId) && (url += `&materialId=${material.materialId}`);

    //  Assign customer management code if exists
    ((customer) && (customer.commercialManagement) && (customer.commercialManagement.commercialManagementCode)) &&
      (url += `&commercialManagementCode=${customer.commercialManagement.commercialManagementCode}`);

    //  Assign customer id if exists
    ((customer) && (customer.customerId)) && (url += `&commercialManagementCode=${customer.customerId}`);

    //  Return the http delete call
    return this.http.delete<ICapacityItemsResponse>(
      url,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('deleteCapacityCheckItems', null)
    );// end http.delete.pipe
  } // end function deleteCapacityItems

  /**
   * Return the product types to query daily plant capacity
   */
  getDailyPlantCapacityProductTypes(): Observable<ProductType[]> {
    return of(PRODUCT_TYPES);
  } // end function getDailyPlantCapacityProductTypes

  /**
   * Maps the response items and return ICapacity objects array
   *
   * @param plantDesc The name of the plant
   * @param productTypeDesc The name of the product type
   * @param response The actual response
   */
  private mapCapacityChartData(
    plantDesc: string,
    productTypeDesc: string,
    response: Object) {

    let result = [];
    let buckets = [];
    if (response !== null && response["capacityItems"]) {
      buckets = response["capacityItems"][0]["buckets"];
    } else {
      return <any>result;
    } // end if capacityItems

    let tonsOffered = 0,
      loadsOffered = 0,
      tonsCommitted = 0,
      loadsCommitted = 0;

    let _date = response["capacityItems"][0].capacityItemDate;

    for (let bucket of buckets) {
      let detail = bucket.bucketDetail;
      for (let customerType of CUSTOMER_TYPES) {
        tonsOffered = detail[customerType.tonsOffered];
        loadsOffered = detail[customerType.loadsOffered];
        tonsCommitted = detail[customerType.tonsCommitted];
        loadsCommitted = detail[customerType.loadsCommitted];

        result.push({
          date: _date,
          hour: bucket.bucketTime,
          plant: plantDesc,
          materialType: productTypeDesc,
          customerType: customerType.name,
          tonsOffered: tonsOffered,
          loadsOffered: loadsOffered,
          tonsCommitted: tonsCommitted,
          loadsCommitted: loadsCommitted
        }); // end push
      } // end for every customer type
    } // end for each bucket

    return <any>result;
  } // end mapCapacityChartData
  /**
   * Get the capacity items from the api, store it in memory and returns a formated data
   *
   * @param plantId The plant to query
   * @param productTypeId The product type to query
   * @param date The date to query
   */
  getCapacityChartData(
    plantId: number,
    plantDesc: string,
    productTypeId: number,
    productTypeDesc: string,
    date: Date,
    commercialManagement: ICommercialManagement = null): Observable<ICapacity[]> {

    let url = `${baseUrl}/v1/oe/businessUnits/${plantId}/capacities?capacityItemDate=${this.stringHelper.formatDate(date)}&materialTypeId=${productTypeId}`;

    if (commercialManagement && (commercialManagement.commercialManagementCode)) {
      url += `&commercialManagementCode=${commercialManagement.commercialManagementCode}`;
    } // end if commercialManagement

    //  Return the http get call
    return this.http.get<ICapacity[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapCapacityChartData(plantDesc, productTypeDesc, response)
    )._catch(
      this.handleError('getCapacityItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function


  /**
   * Groups an array
   */
  groupBy(xs: Array<any>, key: string) {
    if (typeof xs == 'undefined') {
      console.error(`Undefined array in groupBy, key ${key}`);
      return null;
    } // end if xs undefined

    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  } // end function groupBy

  /**
   * Maps the response from producttypes, query capacities, maps the response
   *
   * @param plantId The plant to query capacities
   * @param productTypes The different product types to query capacities and join results
   * @param commercialManagement The commercial management to query capacities for
   *
   * @return Observable<IDailyPlantCapacityItems>
   */
  private mapDailyPlantCapacityItems(
    plant: Plant,
    date: Date,
    productType: ProductType,
    commercialManagement: ICommercialManagement = null
  ) {

    let capacityInquiryResults = [];
    let materialTypeResults = [];
    let customerTypeResults = [];
    let hourlyResults: IHourlySeriesItem[] = [];
    let hourlyLoadsResults: IHourlySeriesItem[] = [];
    let hours: any = {};

    // verify settings
    // if settings, filter by shipping condition
    // Error! we need the current country / business unit set

    for (let customerType of CUSTOMER_TYPES) {
      customerTypeResults.push({
        customerType: customerType.name,
        tonsOffered: 0,
        loadsOffered: 0,
        tonsCommitted: 0,
        loadsCommitted: 0
      }); // end push
    } // end for each customer type

    let labelsTonsOffered = this.translate('rccc.charts.labels.tons_offered');
    let labelsLoadsOffered = this.translate('rccc.charts.labels.loads_offered');
    let labelsTonsCommitted = this.translate('rccc.charts.labels.tons_committed');
    let labelsLoadsCommitted = this.translate('rccc.charts.labels.loads_committed');

    for (let hour of HOURS) {
      let series = [
        {
          name: "tonsOffered",
          label: labelsTonsOffered,
          value: 0
        },
        {
          name: "tonsCommitted",
          label: labelsTonsCommitted,
          value: 0
        }
      ]; // end series

      hourlyResults.push({
        name: hour.hms,
        data: series
      });

      let seriesLoads = [
        {
          name: "loadsOffered",
          label: labelsLoadsOffered,
          value: 0
        },
        {
          name: "loadsCommitted",
          label: labelsLoadsCommitted,
          value: 0
        }
      ]; // end series

      hourlyLoadsResults.push({
        name: hour.hms,
        data: seriesLoads
      });

      hours[hour.hms] = hour.hour;
    } // end for each hours

    const reducer = (accum: any, current: any) => {
      return Math.round((((accum) ? accum : 0) + ((current) ? current : 0)) * 100) / 100;
    }; // end reducer

    this.getCapacityChartData(
      plant.plantId,
      plant.plantDesc,
      productType.productTypeId,
      productType.productTypeDesc,
      date,
      commercialManagement
    ).subscribe(
      capacityCheckItems => {

        let labelsTonsOffered = this.translate('rccc.charts.labels.tons_offered');
        let labelsLoadsOffered = this.translate('rccc.charts.labels.loads_offered');
        let labelsTonsCommitted = this.translate('rccc.charts.labels.tons_committed');
        let labelsLoadsCommitted = this.translate('rccc.charts.labels.loads_committed');

        if (capacityCheckItems.length > 0) {

          capacityInquiryResults = capacityInquiryResults.concat(capacityCheckItems);
          let materialType = productType.productTypeDesc;
          let tonsOffered = capacityCheckItems.map(item => item.tonsOffered).reduce(reducer);
          let tonsCommitted = capacityCheckItems.map(item => item.tonsCommitted).reduce(reducer);
          let loadsOffered = capacityCheckItems.map(item => item.loadsOffered).reduce(reducer);
          let loadsCommitted = capacityCheckItems.map(item => item.loadsCommitted).reduce(reducer);

          materialTypeResults.push({
            materialType: materialType,
            offered: tonsOffered,
            committed: tonsCommitted,
            loadsOffered: loadsOffered,
            loadsCommitted: loadsCommitted,
          }); // end push

          let customerTypeAggResults = this.groupBy(capacityCheckItems, 'customerType');

          for (let customerTypeRecord of customerTypeResults) {
            let data = customerTypeAggResults[customerTypeRecord.customerType];
            if (data) {
              let tonsOffered = data.map(item => item.tonsOffered).reduce(reducer);
              let tonsCommitted = data.map(item => item.tonsCommitted).reduce(reducer);
              let loadsOffered = data.map(item => item.loadsOffered).reduce(reducer);
              let loadsCommitted = data.map(item => item.loadsCommitted).reduce(reducer);
              customerTypeRecord.tonsOffered += tonsOffered;
              customerTypeRecord.tonsCommitted += tonsCommitted;
              customerTypeRecord.loadsOffered += loadsOffered;
              customerTypeRecord.loadsCommitted += loadsCommitted;
            } // end if data
          } // end for each customer type

          let hourlyAggResults = this.groupBy(capacityCheckItems, 'hour');

          for (let hourlyRecord of hourlyResults) {
            let data = hourlyAggResults[hourlyRecord.name];

            if (data) {

              let tonsOffered = data.map(item => item.tonsOffered).reduce(reducer);
              let tonsCommitted = data.map(item => item.tonsCommitted).reduce(reducer);

              for (let series of hourlyRecord.data) {
                if (series.name == "tonsOffered") {
                  series.value += tonsOffered;
                } // end if tonsOffered

                if (series.name == "tonsCommitted") {
                  series.value += tonsCommitted;
                } // end if tonsCommited
              } // end for each series
            } // end if data
          } // end for each hourlyResults

          for (let hourlyRecord of hourlyLoadsResults) {
            let dataLoads = hourlyAggResults[hourlyRecord.name];

            if (dataLoads) {

              let loadsOffered = dataLoads.map(item => item.loadsOffered).reduce(reducer);
              let loadsCommitted = dataLoads.map(item => item.loadsCommitted).reduce(reducer);

              for (let seriesLoads of hourlyRecord.data) {
                if (seriesLoads.name == "loadsOffered") {
                  seriesLoads.value += loadsOffered;
                } // end if tonsOffered

                if (seriesLoads.name == "loadsCommitted") {
                  seriesLoads.value += loadsCommitted;
                } // end if tonsCommited
              } // end for each series
            } // end if data
          } // end for each hourlyResults
        } // end if capacity check items len is 0

        //  Remove hms, replace with hour
        for (let hourlyRecord of hourlyResults) {
          hourlyRecord.name = hours[hourlyRecord.name];
        } // end for each hourlyRecord

        for (let hourlyRecord of hourlyLoadsResults) {
          hourlyRecord.name = hours[hourlyRecord.name];
        } // end for each hourlyRecord

        //  Group by customer type
        let aggResults = this.groupBy(capacityInquiryResults, 'customerType');
        //  Clear the collection
        capacityInquiryResults = [];
        if ((materialTypeResults) && materialTypeResults.length > 0) {

          //  Add "total" customer type
          capacityInquiryResults.push({
            customerType: "total",
            dailyData: materialTypeResults,
            hourlyData: hourlyResults,
            hourlyLoadsData: hourlyLoadsResults,
            tonsOffered: materialTypeResults.map(item => item.offered).reduce(reducer),
            loadsOffered: materialTypeResults.map(item => item.loadsOffered).reduce(reducer),
            tonsCommitted: materialTypeResults.map(item => item.committed).reduce(reducer),
            loadsCommitted: materialTypeResults.map(item => item.loadsCommitted).reduce(reducer),
          });
        } // end if materialTypeResults

        //  At the end, make the translation
        for (let customerTypeRecord of customerTypeResults) {

          if ((materialTypeResults) && materialTypeResults.length > 0) {
            //  Group by material
            if (aggResults[customerTypeRecord.customerType]) {
              let aggMaterial = this.groupBy(aggResults[customerTypeRecord.customerType], 'materialType');
              let aggHourly = this.groupBy(aggResults[customerTypeRecord.customerType], 'hour');

              //  Clear materials collection
              materialTypeResults = [];
              hourlyResults = [];
              hourlyLoadsResults = [];

              //  Loop materials
              for (let materialType in aggMaterial) {

                //  Calculate offered & committed
                let tonsOffered = aggMaterial[materialType].map(item => item.tonsOffered).reduce(reducer);
                let tonsCommitted = aggMaterial[materialType].map(item => item.tonsCommitted).reduce(reducer);
                let loadsOffered = aggMaterial[materialType].map(item => item.loadsOffered).reduce(reducer);
                let loadsCommitted = aggMaterial[materialType].map(item => item.loadsCommitted).reduce(reducer);

                materialTypeResults.push({
                  materialType: materialType,
                  offered: tonsOffered,
                  committed: tonsCommitted,
                  loadsOffered: loadsOffered,
                  loadsCommitted: loadsCommitted,
                }); // end push
              } // end for

              for (let hourly of HOURS) {
                let hourlyData = aggHourly[hourly.hms];

                let series = [
                  {
                    name: "tonsOffered",
                    label: labelsTonsOffered,
                    value: 0
                  },
                  {
                    name: "tonsCommitted",
                    label: labelsTonsCommitted,
                    value: 0
                  }
                ]; // end series

                let seriesLoads = [
                  {
                    name: "loadsOffered",
                    label: labelsLoadsOffered,
                    value: 0
                  },
                  {
                    name: "loadsCommitted",
                    label: labelsLoadsCommitted,
                    value: 0
                  }
                ]; // end series

                if (hourlyData) {

                  let tonsOffered = aggHourly[hourly.hms].map(item => item.tonsOffered).reduce(reducer);
                  let tonsCommitted = aggHourly[hourly.hms].map(item => item.tonsCommitted).reduce(reducer);
                  tonsOffered = (tonsOffered) ? tonsOffered : 0;
                  tonsCommitted = (tonsCommitted) ? tonsCommitted : 0;

                  let loadsOffered = aggHourly[hourly.hms].map(item => item.loadsOffered).reduce(reducer);
                  let loadsCommitted = aggHourly[hourly.hms].map(item => item.loadsCommitted).reduce(reducer);
                  loadsOffered = (loadsOffered) ? loadsOffered : 0;
                  loadsCommitted = (loadsCommitted) ? loadsCommitted : 0;

                  series = [
                    {
                      name: "tonsOffered",
                      label: labelsTonsOffered,
                      value: tonsOffered
                    },
                    {
                      name: "tonsCommitted",
                      label: labelsTonsCommitted,
                      value: tonsCommitted
                    }
                  ]; // end series

                  seriesLoads = [
                    {
                      name: "loadsOffered",
                      label: labelsLoadsOffered,
                      value: loadsOffered
                    },
                    {
                      name: "loadsCommitted",
                      label: labelsLoadsCommitted,
                      value: loadsCommitted
                    }
                  ]; // end series
                } // end if

                hourlyResults.push({
                  name: hourly.hms,
                  data: series
                });

                hourlyLoadsResults.push({
                  name: hourly.hms,
                  data: seriesLoads
                });
              } // end for each hours

              //  Remove hms, replace with hour
              for (let hourlyRecord of hourlyResults) {
                hourlyRecord.name = hours[hourlyRecord.name];
              } // end for each hourlyRecord

              //  Remove hms, replace with hour
              for (let hourlyRecord of hourlyLoadsResults) {
                hourlyRecord.name = hours[hourlyRecord.name];
              } // end for each hourlyRecord

              //  Add to the collection of inquiry
              capacityInquiryResults.push({
                customerType: customerTypeRecord.customerType,
                dailyData: materialTypeResults,
                hourlyData: hourlyResults,
                hourlyLoadsData: hourlyLoadsResults,
                tonsOffered: materialTypeResults.map(item => item.offered).reduce(reducer),
                loadsOffered: materialTypeResults.map(item => item.loadsOffered).reduce(reducer),
                tonsCommitted: materialTypeResults.map(item => item.committed).reduce(reducer),
                loadsCommitted: materialTypeResults.map(item => item.loadsCommitted).reduce(reducer),
              }); // end capacity inquiry results
            } // end if aggResults.customerType
          } // end if material type results
        } // end for each customer type

        //  Update observable subjects
        if ((capacityInquiryResults) && capacityInquiryResults.length) {
          this.dailyPlantCapacityItemsSubject.next(capacityInquiryResults);
        } else {
          this.dailyPlantCapacityItemsSubject.next([]);
        } // end if capacityInquiryResults

        if ((customerTypeResults) && customerTypeResults.length) {
          this.customerTypeCapacityItemsSubject.next(customerTypeResults);
        } // end if customerTypeResults
      } // end anonymous getCapacityCheckItems
    ); // end getCapacityCheckItems.subscribe
  } // end function mapDailyPlantCapacityItems

  /**
   * This procedure query the products, loop the products and get the capacities
   *
   * @param plantId The plant to query
   * @param date The date to query
   *
   */
  queryDailyPlantCapacity(
    plant: Plant,
    productType: ProductType,
    date: Date,
    commercialManagement: ICommercialManagement = null) {
    this.mapDailyPlantCapacityItems(plant, date, productType, commercialManagement);
  } // end getDailyPlantCapacity

  /**
   * Gets the waiting status
   */
  getDailyPlantCapacity(): Observable<ICapacityInquiryItem[]> {
    return this.dailyPlantCapacityItemsSubject;
  } // end function getWaitingStatus

  /**
   * Get the capacity items from the api, store it in memory and returns a formated data
   *
   * @param plantId The plant to query
   * @param productTypeId The product type to query
   * @param date The date to query
   */
  getCapacityCheckItems(
    plantId: number,
    productTypeId: number,
    date: Date,
    commercialManagementCode: string = null,
    customerId: number = null,
    material: number = null): Observable<CapacityDistributionItem[]> {

    let url = this.getEndpoint('plantcapacitiesGet', {
        plantId,
        capacityItemDate: this.stringHelper.formatDate(date),
        productTypeId,
        materialTypeId: productTypeId
      });

    if (commercialManagementCode) {
      url += `&commercialManagementCode=${commercialManagementCode}`;
    } // end if commercialManagementCode

    if (customerId) {
      url += `&customerId=${customerId}`;
    } // end if customer

    if (material) {
      url += `&materialId=${material}`;
    }

    //  Return the http get call
    return this.http.get<CapacityCheckItem[]>(
      url,
      this.authOptions()
    ).map(
      response => { return this.mapCapacityItems(plantId, productTypeId, date, response); }
    )._catch(
      this.handleError('getCapacityItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function

  /**
   * Get the capacity items from the api, store it in memory and returns a formated data
   *
   * @param plantId The plant to query
   * @param productTypeId The product type to query
   * @param date The date to query
   * @param rol The rol to identify the query (check or distribution)
   */
  getCapacityItems(
    plantId: number,
    productTypeId: number,
    date: Date,
    rol = 'admin',
    commercialManagementCode = null,
    customerId = null,
    material = null): Observable<CapacityDistributionItem[]> {

    //  If planner, return distribution
    if (rol == 'planner') {
      return this.getCapacityDistributionItems(plantId, productTypeId, date, commercialManagementCode, customerId, material);
    } // end if planner

    //  Return capacity check items
    return this.getCapacityCheckItems(plantId, productTypeId, date, commercialManagementCode, customerId);
  } // end function getCapacityItems

  /**
   * Takes a CapacityDistributionItem and transform it into a BucketDetail
   *
   * @param capacityDistributionItem The capacity distribution item
   */
  getBucketDetail(capacityDistributionItem: CapacityDistributionItem): BucketDetail {
    let detail = new BucketDetail();
    for (let item of capacityDistributionItem.items) {
      let customerType = CUSTOMER_TYPES.filter(cust => cust.name == item.customerType)[0];
      detail[customerType.tonsOffered] = item.tonsOffered;
      detail[customerType.loadsOffered] = item.loadsOffered;
      detail[customerType.tonsCommitted] = item.tonsCommitted;
      detail[customerType.loadsCommitted] = item.loadsCommitted;
    } // end for each item of capacityDistributionItem.items
    return detail;
  } // end function getBucketDetail

  /**
   * Updates a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  updateOverallCapacity(
    plantId: number,
    material: IMaterial,
    customer: ICustomer = null,
    date: Date,
    capacityCheckItems: CapacityCheckItem[]
  ): Observable<IUpdateCapacityItemsResponse> {

    //  Here construct the url
    let url = this.getEndpoint('plantcapacitiesUpdate', {
      plantId,
      capacityDate: this.stringHelper.formatDate(date)
    });

    //  Set up the capacityItem
    let items = capacityCheckItems.filter(
      item => item.isDirty
    ); // end filter

    let buckets: Array<IUpdateBucket> = [];

    for (let item of items) {

      let bucket: IUpdateBucket = {
        bucketId: item.bucketId,
        productTypeId: material.materialType.materialTypeId,
        commercialManagementCode: null,
        bucketDateTime: String(this.stringHelper.formatDate(date)+"T"+item.time),
        totalQuantityOffer: item.tonsOffered,
        totalLoadOffer: item.loadsOffered
      }; // end bucket push

      if (customer && customer.commercialManagement.commercialManagementCode) {
        bucket.commercialManagementCode = customer.commercialManagement.commercialManagementCode;
      } // end if customer

      buckets.push(bucket);
    } // end for

    //  Here construct the json payload
    let payload = {};
    payload["buckets"] = buckets;

    //  Return the http put call
    return this.http.put<IUpdateCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('saveCapacityItems', null)
    );// end http.put.pipe
  } // end saveCapacityItems


  /**
   * Retrieves the shipping condition from a customer type name
   *
   * @param customerTypeName
   *
   * @return number
   */
  private getShippingConditionId(customerTypeName: string): number {
    let shippingConditions = this.getEnvShippingConditions();
    let shippingCondition = shippingConditions.filter(ct => ct.shippingConditionDesc == customerTypeName)[0];
    return shippingCondition.shippingConditionId;
  } // end function getShippingCondition

  /**
   * Updates a set of distributed capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  updateDistributedCapacity(
    plantId: number,
    material: IMaterial,
    customer: ICustomer = null,
    date: Date,
    capacityDistributionItems: CapacityDistributionItem[]
  ): Observable<IUpdateCapacityItemsResponse> {

    //  Here construct the url
    let url = this.getEndpoint('plantcapacitiesDistributedUpdate', {
      plantId,
      capacityDate: this.stringHelper.formatDate(date)
    });

    //  Set up the capacityItem
    let items = capacityDistributionItems.filter(
      item => item.isDirty
    ); // end filter

    let buckets: Array<IUpdateBucketDetail> = [];

    for (let item of items) {
      for (let dItem of item.items) {

        if (dItem.isDirty) {
          let bucket: IUpdateBucketDetail = {
            bucketId: item.bucketId,
            bucketDetailId: dItem.bucketId,
            shippingConditionId: this.getShippingConditionId(dItem.customerType),
            quantityOffer: dItem.tonsOffered,
            loadOffer: dItem.loadsOffered
          }; // end bucket push

          buckets.push(bucket);

        } // end if dItem.isdirty
      } // end for dItem
    } // end for item

    //  Here construct the json payload
    let payload = {};
    payload["distributedBuckets"] = buckets;

    //  Return the http put call
    return this.http.put<IUpdateCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('saveCapacityItems', null)
    );// end http.put.pipe
  } // end saveCapacityItems

  /**
   * Updates a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  updateCapacityCheckItems(
    plantId: number,
    material: IMaterial,
    customer: ICustomer = null,
    date: Date,
    capacityCheckItems: CapacityCheckItem[]
  ): Observable<IUpdateCapacityItemsResponse> {

    //  Here construct the url
    let url = `${baseUrl}/v1/oe/businessUnits/${plantId}/capacities/${this.stringHelper.formatDate(date)}`;

    //  Set up the capacityItem
    let items = capacityCheckItems.filter(
      item => item.isDirty
    ); // end filter

    let capacityItem = new CapacityItem();
    capacityItem.capacityId = 0;
    capacityItem.capacityItemDate = `${this.stringHelper.formatDate(date)}`;

    if (material) {
      capacityItem.material = material;
    } // end if material

    if (customer) {
      capacityItem.customer = customer;
    } // end if customer

    capacityItem.buckets = [];

    for (let item of items) {
      let bucket = new Bucket();
      bucket.bucketId = item.bucketId;
      bucket.bucketTime = item.time;
      bucket.bucketDetail = new BucketDetail();
      bucket.totalLoadsComm = item.loadsCommitted;
      bucket.totalLoadsOff = item.loadsOffered;
      bucket.totalQtyComm = item.tonsCommitted;
      bucket.totalQtyOff = item.tonsOffered;
      //  Here get the detail
      //  Before the push
      if (item.hasOwnProperty("items")) {
        bucket.bucketDetail = this.getBucketDetail(<CapacityDistributionItem>item);
      } // end if item has items
      capacityItem.buckets.push(bucket);
    } // end for

    //  Here construct the json payload
    let payload = {};
    payload["capacityItems"] = [capacityItem];

    //  Return the http put call
    return this.http.put<IUpdateCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('saveCapacityItems', null)
    );// end http.put.pipe
  } // end saveCapacityItems

  /**
   * Deletes a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  cloneCapacityCheckItems(
    plantId: number,
    material: IMaterial,
    customer: ICustomer = null,
    date: Date,
    fromDate: Date,
    toDate: Date
  ): Observable<ICloneCapacityItemsResponse> {
    // https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/oe/businessUnits/387/capacities/2018-02-08/clone
    // Method post

    //  Here construct the url
    let url = this.getEndpoint('plantcapacitiesClone', {
      plantId,
      capacityDate: this.stringHelper.formatDate(date),
      countryCode: this.getCurrentUserCountry()
    });

    //  The payload:
    //  {"dateTimeFrom":"2018-02-09","dateTimeTo":"2018-02-09","materialTypeId":"2"}
    let payload: any = {};

    payload = {
      dateTimeFrom: this.stringHelper.formatDate(fromDate),
      dateTimeTo: this.stringHelper.formatDate(toDate),
      materialTypeId: material.materialType.materialTypeId,
      productTypeId: material.materialType.materialTypeId
    }; // end payload object

    // If commercial management, add to the payload
    ((customer) && (customer.commercialManagement)) &&
      (payload.commercialManagementCode = customer.commercialManagement.commercialManagementCode);

    // if material id, add to the payload
    ((material) && (material.materialId)) && (payload.materialId = material.materialId);

    //  if customer id, add to the payload
    ((customer) && (customer.customerId)) && (payload.customerId = customer.customerId);

    //  Return the http post call
    return this.http.post<ICloneCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('cloneCapacityCheckItems', null)
    );// end http.post.pipe
  } // end cloneCapacityItems

  /**
   * Perform import model action
   *
   * @param FormData The form to send
   *
   * @return Observable<ICapacityItemsResponse>
   */
  importModel(formData: FormData, rol: string): Observable<ICapacityItemsResponse> {
    // https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/oe/documents/ctp/upload
    // Method post

    //  Here construct the url
    let url = "";
    if (rol == "admin") {
      url = this.getEndpoint('plantcapacitiesOverallImport', {entity: 'ctp'});
    } // end if admin
    if (rol == "planner") {
      url = this.getEndpoint('plantcapacitiesDistributedImport', {entity: 'ctpod'});
    } // end if rol is planner

    //  Return the http post call
    return this.http.post<ICloneCapacityItemsResponse>(
      url,
      formData,
      {
        headers: new HttpHeaders({
          'authorization': `Bearer ${this.authData["oauth2"]["access_token"]}`,
          'jwt': this.authData["jwt"]
        })
      }
    ).map(
      response => response
    )._catch(
      this.handleError('importModel', null)
    );// end http.post.pipe
  } // end function import model

  /**
   * Validates the response for a call to update capacity items
   *
   * @param response The update capacity items response
   *
   * @return {undefined}
   */
  validateUpdateResponse(response: IUpdateCapacityItemsResponse): IUpdateCapacityItemsResponse {
    return response;
  } // end function validateUpdateResponse

  public GetFleetType(): Observable<FleetType[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleettypes`;
    return this.http.get(
      url,
      options
    ).map(
      response => {
        let result: FleetType[] = <FleetType[]>response['fleetTypes'];
        for (let index in result) {
          result[index].changeDateTime = this.fromUTC(result[index].changeDateTime);
          result[index].creationDateTime = this.fromUTC(result[index].creationDateTime);
        } // end for each item
        return result;
      }
    )._catch(
      this.handleError('GetFleetType', null)
    );// end http.post.pipe
  }

  public InsertFleetType(fleetType: FleetType[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleettypes`;
    const fleetTypes = { 'fleetTypes': fleetType };

    return this.http.post(
      url,
      fleetTypes,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('InsertFleetType', false));
  }

  public UpdateFleetType(fleetType: FleetType[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleettypes`;
    const fleetTypes = { 'fleetTypes': fleetType };

    return this.http.patch(
      url,
      fleetTypes,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('UpdateFleetType', false));
  }

  public DeleteFleetType(fleetType: FleetType): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleettypes/${fleetType.fleetTypeId}`;
    return this.http.delete(
      url,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('DeleteFleetType', false));
  }

  public GetFleetCoverage(): Observable<FleetCoverage[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleetcoverages`;
    return this.http.get(
      url,
      options
    ).map(
      response => {
        let result: FleetCoverage[] = <FleetCoverage[]>response['fleetCoverages'];
        for (let index in result) {
          result[index].changeDateTime = this.fromUTC(result[index].changeDateTime);
          result[index].creationDateTime = this.fromUTC(result[index].creationDateTime);
        } // end for each item
        return result;
      }
    )._catch(
      this.handleErrorMoreInformation('GetFleetCoverage', null)
    );
  }

  public InsertFleetCoverage(fleetCoverages: FleetCoverage[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleetcoverages`;
    const coverages = { 'fleetCoverages': fleetCoverages };

    return this.http.post(
      url,
      coverages,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('InsertFleetCoverage', false));
  }

  public UpdateFleetCoverage(fleetCoverages: FleetCoverage[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleetcoverages`;
    const coverages = { 'fleetCoverages': fleetCoverages };

    return this.http.patch(
      url,
      coverages,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('UpdateFleetCoverage', false));
  }

  public DeleteFleetCoverage(fleetCoverage: FleetCoverage): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleetcoverages/${fleetCoverage.fleetCoverageId}`;

    return this.http.delete(
      url,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('DeleteFleetCoverage', false));
  }

  public GetFleetTypeByBusinessUnit(): Observable<FleetTypeBusinessUnit[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/myfleets`;
    return this.http.get(
      url,
      options
    ).map(
      response => {
        let result: FleetTypeBusinessUnit[] = <FleetTypeBusinessUnit[]>response['fleets'];
        for (let index in result) {
          result[index].changeDateTime = this.fromUTC(result[index].changeDateTime);
          result[index].creationDateTime = this.fromUTC(result[index].creationDateTime);
        } // end for each item
        return result;
      }
    )._catch(
      this.handleErrorMoreInformation('GetFleetTypeByBusinessUnit', null)
    );
  }

  public InsertFleetTypeByBusinessUnit(fleetType: FleetTypeBusinessUnit[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    let payload: any[] = [];

    for (let row of fleetType) {
      payload.push({
        plantId: row.plantId,
        fleetTypeId: row.fleetTypeId,
        productTypeGroupId: row.productTypeGroupId,
        fleetCoverageId: row.fleetCoverageId,
        crane: row.crane ? row.crane : false,
        moffet: row.moffett ? row.moffett : false,
        initialWeight: Number(row.initialWeight),
        finalWeight: Number(row.finalWeight)
      }); // end payload push
    } // end for

    const url = `${baseUrl}/v2/oe/fleets`;
    const fleetTypeBU = { 'fleets': payload };

    return this.http.post(
      url,
      fleetTypeBU,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('InsertFleetTypeByBusinessUnit', false));
  }

  public UpdateFleetTypeByBusinessUnit(fleetType: FleetTypeBusinessUnit[]): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleets`;
    const coverages = { 'fleets': fleetType };

    return this.http.patch(
      url,
      coverages,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('UpdateFleetTypeByBusinessUnit', false));
  }

  public DeleteFleetTypeByBusinessUnit(fleetType: FleetTypeBusinessUnit): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v2/oe/fleets/${fleetType.fleetId}`;

    return this.http.delete(
      url,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('DeleteFleetTypeByBusinessUnit', false));
  }

  /**
   * GetProductsByPlantAndProductType
   */
  public GetProductsByPlantAndProductType(plantCode: string, productTypeId: number): Observable<Product[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v3/mm/products?productType=${productTypeId}&plantCode=${plantCode}`;

    return this.http.get(
      url,
      options
    ).map(response => {
      if (response === null || response === undefined) {
        return null;
      }
      return <Product[]>response['products'];
    })._catch(this.handleErrorMoreInformation('GetProductsByPlantAndProductType', null));
  }

  public getCountries(): Observable<Country[]> {
    let options = this.authOptions();
    options.responseType = 'json';
    const url = `${baseUrl}/v5/ce/catalogs?code=CNT`;

    return this.http.get(
      url,
      options
    ).map(response => {
      if (response === null || response === undefined) {
        return null;
      }
      return <Country[]>response['entries'];
    })._catch(this.handleError('GetCountry', null));
  }

  /**
   * Checks if empty
   */
  isEmptyObject(obj: any) {
    if (typeof obj == "undefined" || obj === null) {
      return true;
    }
    return (obj && (Object.keys(obj).length === 0));
  } // end function isEmptyObject

  /**
   * Maps a json object to a capacities objects
   *
   * @param plantId         The plant from we get the capacities
   * @param date            The capacities date
   * @param response        The json object obtained of the api
   */
  private mapFleetCapacityItems(
    plantId,
    date,
    response: Object) {

    let result: any[] = [];
    for (let item of response["capacityItems"]) {
      result.push({
        capacityId: item.capacityId,
        fleetId: item.fleetId,
        fleetTypeDesc: item.fleetTypeCode + " - " + item.fleetTypeDesc,
        offeredUnits: item.offeredUnits,
        committedUnits: item.committedUnits,
        availableUnits: item.offeredUnits - item.committedUnits
      }); // end push
    } // end for each item

    return <any>result;
  } // end function mapCapacities

  /**
   * Maps a json object to a capacities objects
   *
   * @param response        The json object obtained of the api
   */
  private mapFleetCapacityDashboardItems(
    response: Object
  ) {

    let result: any[] = [];
    for (let item of response["fleetCapacityItems"]) {
      result.push({
        capacityId: item.capacityId,
        fleetId: item.fleetId,
        fleetTypeDesc: item.fleetTypeCode + " - " + item.fleetTypeDesc,
        businessUnitDesc: item.businessUnitDesc,
        offeredUnits: item.offeredUnits,
        committedUnits: item.committedUnits,
        availableUnits: item.offeredUnits - item.committedUnits
      }); // end push
    } // end for each item

    return <any>result;
  } // end function mapCapacities

  /**
   * Get the capacity items from the api, store it in memory and returns a formated data
   *
   * @param plantId The plant to query
   * @param date The date to query
   */
  getFleetCapacityItems(
    plantId: number,
    date: Date): Observable<FleetCapacityItem[]> {
    //https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/oe/businessUnits/387/capacities?capacityItemDate=2018-01-22&materialTypeId=2

    let url = `${baseUrl}/v2/oe/plants/${plantId}/fleet/capacities?capacityDate=${this.stringHelper.formatDate(date)}`;
    //let url = 'staging/fleet-capacities.json';

    //  Return the http get call
    return this.http.get<FleetCapacityItem[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapFleetCapacityItems(plantId, date, response)
    )._catch(
      this.handleError('getFleetCapacityItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function

  /**
   * Updates a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  updateFleetCapacityItems(
    plantId: number,
    date: Date,
    fleetCapacityItems: FleetCapacityItem[]
  ): Observable<IUpdateCapacityItemsResponse> {

    //v1/oe/businessUnits/387/capacities/2018-01-24
    //  Method put
    //  payload: {"capacityItems":[{}]}

    //  Here construct the url
    let url = `${baseUrl}/v2/oe/plants/${plantId}/fleet/capacities/${this.stringHelper.formatDate(date)}`;
    //let url = 'staging/success.json';

    //  Set up the capacityItem
    let items = fleetCapacityItems.filter(
      item => item.isDirty
    ); // end filter

    let result: any[] = [];

    for (let item of items) {
      result.push({
        capacityId: item.capacityId,
        fleetId: item.fleetId,
        offeredUnits: item.offeredUnits
      }); // end push
    } // end for each item

    //  Here construct the json payload
    let payload = {};
    payload["capacityItems"] = result;

    //  Return the http put call
    return this.http.put<IUpdateCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('saveFleetCapacityItems', null)
    );// end http.put.pipe
  } // end saveCapacityItems

  /**
   * Deletes a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   */
  deleteFleetCapacityItems(
    plantId: number,
    date: Date
  ): Observable<ICapacityItemsResponse> {
    // https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/oe/businessUnits/387/capacities/2018-02-07?materialTypeId=2
    //  Method delete

    //  Here construct the url
    let url = `${baseUrl}/v2/oe/plants/${plantId}/fleet/capacities/${this.stringHelper.formatDate(date)}`;
    //let url = 'staging/success.json';

    //  Return the http put call
    return this.http.delete<ICapacityItemsResponse>(
      url,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('deleteFleetCapacityCheckItems', null)
    );// end http.put.pipe
  } // end deleteFleetCapacityItems

  /**
   * Converts a datetime from UTC to local time
   *
   * @param date The date to convert
   */
  public fromUTC(date: string): string {
    if (typeof date == 'undefined') {
      return '';
    } // end if invalid date
    return new Date((date + " UTC").replace("T", " ")).toLocaleString();
  } // end fromUTC

  /**
   * Deletes a set of capacity items
   *
   * @param plantId The plant id to make the change
   * @param date The date of the changes
   * @param capacityItems The capacity items to update
   */
  cloneFleetCapacityItems(
    plantId: number,
    date: Date,
    fromDate: Date,
    toDate: Date
  ): Observable<ICloneFleetCapacityItemsResponse> {

    let url = `${baseUrl}/v2/oe/plants/${plantId}/fleet/capacities/${this.stringHelper.formatDate(date)}/clone`;

    //  The payload:
    //  {"dateTimeFrom":"2018-02-09","dateTimeTo":"2018-02-09","materialTypeId":"2"}
    let payload = {
      dateTimeFrom: this.stringHelper.formatDate(fromDate),
      dateTimeTo: this.stringHelper.formatDate(toDate)
    }; // end payload object

    //  Return the http put call
    return this.http.post<ICloneFleetCapacityItemsResponse>(
      url,
      payload,
      this.authOptions()
    ).map(
      response => response
    )._catch(
      this.handleError('cloneFleetCapacityItems', null)
    );// end http.put.pipe
  } // end function cloneFleetCapacityItems

  public GetHolidays(country: Country, date: ComboMonth, dateFormat: string): Observable<Holiday[]> {
    let options = this.authOptions();
    options.responseType = 'json';
    let url = `${baseUrl}/v1/hrm/holidays?countryCode=${country.entryCode.trim()}`;

    if (date !== undefined) {
      let initialDate = moment(new Date(date.year, date.month, 1)).format('YYYY-MM-DD');
      let finalDate = moment(new Date(date.year, date.month + 1, 0)).format('YYYY-MM-DD');

      url = `${url}&dateFrom=${initialDate}&dateTo=${finalDate}`;
    }

    return this.http.get(
      url,
      options
    ).map(response => {
      if (response === null || response === undefined) {
        return null;
      }
      let holidays = <Holiday[]>response['holidays'];
      return holidays.map(value => {
        value.date.iso = moment(value.date.iso).format(dateFormat);
        value.holidayDate = value.date.iso;

        value.affectedDate = moment({
          y: value.date.dateTime.year,
          M: value.date.dateTime.month - 1,
          d: value.date.dateTime.day
        }).format(dateFormat);
        return value;
      })
    })._catch(this.handleError('GetHolidays', null));
  }

  public InsertHoliday(holiday: Holiday): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/hrm/holidays`;

    return this.http.post(
      url,
      holiday,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('InsertHoliday', false));
  }

  public UpdateHolidays(holiday: Holiday): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/hrm/holidays/${holiday.holidayId}`;

    return this.http.patch(
      url,
      holiday,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('UpdateHolidays', false));
  }

  public DeleteHoliday(holidayId: number): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/hrm/holidays/${holidayId}`;

    return this.http.delete(
      url,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('DeleteHoliday', false));
  } // end function delete holiday

  /**
   * Maps a json object to a availability inquiries objects
   *
   * @param response        The json object obtained of the api
   */
  private mapAvailabilityInquiriesItems(
    response: Object) {
    return <any>response["capacityItems"];
  } // end function mapCapacities

  /**
   * Get the availability inquiries from the api
   *
   * @param date The date to query
   */
  getAvailabilityInquiriesItems(
    capacityDateFrom: Date,
    capacityDateTo: Date
  ): Observable<ICapacityReport[]> {

    //let url = `${baseUrl}/v1/oe/reporting/capacities?capacityDate=${this.stringHelper.formatDate(date)}`;
    let url = `${baseUrl}/v1/oe/reporting/capacities?capacityDateFrom=${this.stringHelper.formatDate(capacityDateFrom)}&capacityDateTo=${this.stringHelper.formatDate(capacityDateTo)}`;
    //let url = 'staging/availability-inquiries.json';

    //  Return the http get call
    return this.http.get<ICapacityReport[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapAvailabilityInquiriesItems(response)
    )._catch(
      this.handleError('getAvailabilityInquiriesItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function

  /**
   * Get the availability inquiries from the api
   *
   * @param date The date to query
   */
  getFleetCapacityDashboardItems(
    capacityDateFrom: Date,
    capacityDateTo: Date
  ): Observable<IFleetCapacityReportItem[]> {

    let url = `${baseUrl}/v2/oe/reporting/fleet/capacities?capacityDateFrom=${this.stringHelper.formatDate(capacityDateFrom)}&capacityDateTo=${this.stringHelper.formatDate(capacityDateTo)}`;
    //let url = 'staging/fleet-capacities.json';

    //  Return the http get call
    return this.http.get<IFleetCapacityReportItem[]>(
      url,
      this.authOptions()
    ).map(
      response => this.mapFleetCapacityDashboardItems(response)
    )._catch(
      this.handleError('getFleetCapacityDashboardItems', [])
    );// end http.get.pipe
  } // end getCapacityItems function

  public GetCustomers(): Observable<ICustomer[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = 'staging/customers.json';

    return this.http.get(url, options).map(response => {
      let result: ICustomer[] = <ICustomer[]>response['customers'];
      result.splice(
        0,
        0,
        {
          customerId: -1,
          customerCode: "",
          customerDesc: ""
        }
      );
      return result;
    });
  } // end function get customers

  public GetMaterials(): Observable<Material[]> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = 'staging/material.json';

    return this.http.get(url, options).map(response => {
      return <Material[]>response['material'];
    });
  } // end function get materials

  public getUnlockTimes(country: Country = null, materialType: ProductType = null): Observable<UnlockTime[]> {
    let options = this.authOptions();
    options.responseType = 'json';
    let url = `${baseUrl}/v1/oe/settings/offer/unlocktime`;

    if (country && !materialType) {
      url = `${url}?countryCode=${country.entryCode}`;
    } else if (!country && materialType) {
      url = `${url}?materialTypeId=${materialType.productTypeId}`;
    } else if (country && materialType) {
      url = `${url}?countryCode=${country.entryCode.trim()}&materialTypeId=${materialType.productTypeId}`;
    }

    return this.http.get(
      url,
      options
    ).map(response => {
      if (response === null || response === undefined) {
        return null;
      }
      return <UnlockTime[]>response['unlockTimeItems'];
    })._catch(this.handleError('getUnlockTimes', null));
  } // end function get unlock times

  public InsertUnlockTime(unlockSetting: UnlockTime): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/oe/settings/offer/unlocktime`;

    return this.http.post(
      url,
      {
        unlockTime: unlockSetting.unlockTime,
        materialTypeId: unlockSetting.materialTypeId,
        countryCode: unlockSetting.countryCode
      },
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('InsertUnlockTime', false));
  }

  public UpdateUnlockTime(unlockSetting: UnlockTime): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/oe/settings/offer/unlocktime/${unlockSetting.unlockTimeId}`;

    return this.http.patch(
      url,
      unlockSetting,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('UpdateUnlockTime', false));
  }

  public DeleteUnlockTime(unlockSettingId: number): Observable<boolean> {
    let options = this.authOptions();
    options.responseType = 'json';

    const url = `${baseUrl}/v1/oe/settings/offer/unlocktime/${unlockSettingId}`;

    return this.http.delete(
      url,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(this.handleErrorMoreInformation('DeleteUnlockTime', false));
  } // end function DeleteUnlockTime


  public getConfiguredPlants(countryCode: string): Observable<ConfiguredPlants> {
    //let url = baseUrl + "/v2/oe/settings/configuredplants?countryCode=" + countryCode;
    let url = `${settingsUrl}/${API_ENDPOINTS.configuredPlants.replace('{countryCode}', countryCode)}`;
    let options = this.authOptions();

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('getBusinessUnitSettings', false));
  }

  public getBusinessUnitSettings(countryCode: string, plantCode: string): Observable<IBusinessUnitSettings> {
    const url = `${settingsUrl}/${API_ENDPOINTS.businessUnitSettings.replace('{countryCode}', countryCode)}/${plantCode}`;

    let options = this.authOptions();
    options.responseType = 'json';

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('getBusinessUnitSettings', false));
  }

  public updateBusinessUnitSettings(countryCode: string, plantCode: string, businessUnitSettings: IBusinessUnitSettings): Observable<boolean> {
    let options = this.authOptions();

    const url = `${settingsUrl}/${API_ENDPOINTS.businessUnitSettings.replace('{countryCode}', countryCode)}/${plantCode}`;

    return this.http.put(url, businessUnitSettings, options)
      .map(response => <boolean>response['success'])
      ._catch(this.handleErrorMoreInformation('updateBusinesUnitsSettings', false));
  }

  public getCountrySettings(countryCode: string): Observable<ICountrySettings> {
    let options = this.authOptions();
    //const url = baseUrl + "/v2/oe/settings/countrysettings/" + countryCode;
    const url = `${settingsUrl}/${API_ENDPOINTS.countrySettings}/${countryCode}`;

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('getCountrySettings', false));
  }

  public getApplicationClients(): Observable<IApplicationClients> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/applicationclients/";

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));
  }

  public getDeliveryWindows(): Observable<IDeliveryWindows> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/deliverywindows/";

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));
  }

  public getGeolocationServices(): Observable<IGeolocationServices> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/geolocationservices/";

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));
  }

  public getDigitalConfirmationProcesses(): Observable<IDigitalConfirmationProcesses> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/digitalconfirmationprocesses/";

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));
  }

  public getProductTypesForSettings(): Observable<IProductTypes> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/producttypes/";

    console.log("Servicio de settings materyal types")
    console.log(url);
    console.log(options);

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));

    // .map(response => this.mapProductTypes(response))
  }

  public getShippingTypes(): Observable<IShippingTypes> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/shippingtypes/";

    return this.http.get(url, options)
      .map(response => <any>response)
      ._catch(this.handleErrorMoreInformation('', false));
  }

  public getShippingConditions(): Observable<IShippingConditions> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/shippingconditions";

    return this.http.get(url, options)
      .map(response => <any>this.mapShippingConditions(response))
      ._catch(this.handleErrorMoreInformation('', false));
  }

  async getShippingConditionsResult(): Promise<IShippingConditions> {
    let options = this.authOptions();
    const url = imUrl + "/v2/im/shippingConditions";
    let shippingConditions: IShippingConditions =
      await this.http.get(url, options).toPromise().then(
        response => <any>this.mapShippingConditions(response)
      );
    return shippingConditions;
  } // end getShippingConditionsResult

  private mapShippingConditions(response: any): IShippingConditions {
    let mapped: IShippingConditions = {
      shippingConditions: []
    }

    response.shippingConditions.forEach(ship => {
      let sc: ShippingCondition = {
        shippingConditionId: ship.shippingConditionId,
        shippingConditionCode: ship.shippingConditionCode,
        shippingConditionDesc: ship.shippingConditionDesc,
        selected: false
      }

      mapped.shippingConditions.push(sc);
    });

    return mapped;
  }

  /**
   * Posts a country settings
   *
   * @param countrySettings The settings to request its addition to the service
   *
   */
  public insertCountrySettings(countrySettings: ICountrySettings): Observable<boolean> {

    //  auth options
    let options = this.authOptions();

    //  the endpoint
    const url = `${settingsUrl}/${API_ENDPOINTS.countrySettings}`;

    //  perform the http request
    return this.http.post(
      url,
      countrySettings,
      options
    ).map(response => {
      return <boolean>response['success'];
    })._catch(
      this.handleErrorMoreInformation('insertCountrySettings', false)
    ); // end function insertBusinessUnitSettings

  } // end function insertCountryCalendar


  /**
   * Update country settings
   *
   * @param countrySettings ICountrySettings
   */
  public updateCountrySettings(countrySettings: ICountrySettings): Observable<boolean> {

    //  auth options
    let options = this.authOptions();

    //  the country code
    let countryCode = countrySettings.countryCode;

    //  the endpoint
    const url = `${settingsUrl}/${API_ENDPOINTS.countrySettings}/${countryCode}`;

    //  perform the http request
    return this.http.put(
      url,
      countrySettings,
      options
    ).map(response => {
      let success = response['success'];
      if (typeof success == "string") {
        return (success == "true");
      } // end if string
      return success;
    })._catch(this.handleErrorMoreInformation('updateCountrySettings', false));

  } // end function insertCountryCalendar

  /**
   * Returns the country code
   */
  public getCountryCode(): string {
    return sessionStorage.getItem('country');
  } // end function getCountryCode

  /**
   * Evaluates an empty string
   */
  public isEmpty(obj: any): boolean {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      } // end if has own property
    } // end for each obj

    return JSON.stringify(obj) === JSON.stringify({});
  } // end function isEmpty

  /**
   * Returns the current user country
   */
  public getCurrentUserCountry(): string {
    return sessionStorage.getItem('country');
  } // end function getCurrentUserCountry

  /**
   * Indicates if fleet confirmation items should be displayed
   */
  public showFleetConfirmation(): boolean {
    if (this.getCurrentUserCountry() == 'CO') {
      return false;
    } // end if get current user country is Colombia

    return true;
  } // end function showFleetConfirmation

  /**
   * Maps a json object to a product type group
   *
   * @param response The json object
   */
  private mapProductTypeGroups(response: Object) {
    if (response["productTypeGroup"]) {
      let productTypeGroups = response["productTypeGroup"];
      productTypeGroups = productTypeGroups.sort(
        (row1, row2) => {
          if (row1.productTypeGroupCode > row2.productTypeGroupCode) {
            return 1;
          } // end if >
          if (row1.productTypeGroupCode < row2.productTypeGroupCode) {
            return -1;
          } // end if <
          //  The same
          return 0;
        } // end anonymous function
      ); // end sort

      let country: string = this.getCurrentUserCountry();
      productTypeGroups = productTypeGroups.filter(
        p => {
          if (country == 'MX') {
            if (p.productTypeGroupCode != '002') {
              return p;
            } // end if not || 002
          } else {
            if (p.productTypeGroupCode == '001' || p.productTypeGroupCode == '002') {
              return p;
            } // end if 001 || 002
          } // end if then else MX
        }); // end filter
      return productTypeGroups;
    } else {
      console.error("No product type groups!!");
      return null;
    } // end if productTypes
  } // end mapProductTypeGroups

  /**
   * Gets product types groups
   *
   */
  getProductTypeGroups(): Observable<ProductTypeGroup[]> {
    //https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v1/mm/producttypes?plantid=387
    return this.http.get<ProductTypeGroup[]>(
      `${baseUrl}/v2/oe/producttypegroup`,
      this.authOptions()
    ).map(response => this.mapProductTypeGroups(response))._catch(
      this.handleError('getProductTypeGroups', null)
    ); // end http.get.map._catch
  } // end get product type

 /**
  * Returns an api endpoint, based in the current country
  *
  * @param key The key to look for
  * @param params A list of params. Default is null
  *
  * @return string
  */
  getEndpoint(key: string, params: any = null): string {
    let versionNumber: number = this.versionToggle.getVersion();
    if (versionNumber == 2 && !this.versionToggle.isNormalized()) {
      versionNumber = 1;
    } // end if versionToogle

    let version = "v"+versionNumber;
    let endpoints = ENDPOINTS[version];

    if (!endpoints.hasOwnProperty(key)) {
      throw new Error(`Version ${version} does not contains api endpoint key ${key}`);
    } // end if does not have property

    let endpoint = endpoints[key];

    for (let param in params) {
      endpoint = endpoint.replace('{'+param+'}', params[param]);
    } // end for each param

    if (endpoint.includes('{')) {
      throw new Error('One or more parameters not speficied un endpoint');
    } // end if contains {

    endpoint = `${baseUrl}${endpoint}`;
    return endpoint;
  } // end function getEndpoint

  /**
   *
   * Gets product types groups
   *
   */
  validateV3(): Observable<any> {
    return this.http.post<ICloneCapacityItemsResponse>(
      `${baseUrl}/v3/oe/documents/ctp/upload`,
      null,
      {
        headers: new HttpHeaders({
          'authorization': `Bearer ${this.authData["oauth2"]["access_token"]}`,
          'jwt': this.authData["jwt"]
        })
      }
    ).map(
      response => response
    )._catch(
      this.handleError('validateV3', null)
    );// end http.post.pipe
  } // end get product type

  /**
   * Return shipping conditions depending on environment
   */
  public getEnvShippingConditions(): ShippingCondition[] {
    let dataCenter = this.versionToggle.getDataCenter();
    let env = this.versionToggle.getEnvironment();
    let result: ShippingCondition[] = SHIPPING_CONDITIONS[dataCenter][env];

      /*    for (let sc of result) {
      sc.shippingConditionDesc = this.translate(sc.shippingConditionDesc);
    } // end for each shipping condition
*/
    if (result.length == 0) {
      throw new Error('There is no shipping conditions for this environtment');
    } // end if result len is 0
    return result;
  } // end function getEnvShippingCondition

  /**
   * Clones an object, returning a new object
   *
   * @param obj The object to clone
   *
   * @return any
   */
  public cloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  } // end function cloneObject

  // function for dynamic sorting
  public compareValues(key, order='asc'): any {
      return (a, b) => {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA > varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  } //end function compareValues

} // end class CnxGblOrgService