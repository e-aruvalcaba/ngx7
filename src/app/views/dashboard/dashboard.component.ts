import {
  Component, OnInit, Injector, OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/Rx';
import { PlantCapacityComponent } from '../plant-capacity/plant-capacity.component';
import { ICapacityReport } from '../../models/capacity-report.interface';
import { Plant } from '../../models/plant';
import { ISeriesItem } from '../../models/series-item.interface';
import { IHourlySeriesItem } from '../../models/hourly-series-item.interface';
import { ProductType } from '../../models/product-type';
import { DashPanelComponent }  from '../dash-panel/dash-panel.component';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
import { IMatrixValue, IMatrixColumn, IMatrixRow } from '../../models/datamatrix.interface';
import { IFleetCapacityReportItem } from '../../models/fleet-capacity-report-item.interface';
import { ICountrySettings } from '../../models/country-settings.interface';

export interface IBusinessUnit {
  businessUnitId?: number;
  businessUnitCode?: string;
  businessUnitDesc?: string;
} // end interface business unit

export class HtmlTableCell {
  colspan?: number;
  text: string;

  constructor(text: string) {
    this.text = text;
  } // end function constructor
} // end interface html table cell

/**
 * HtmlRow
 */
export class HtmlTableRow {
  rowspan?: number;
  cells: HtmlTableCell[];

  /**
   * Creates an instance of HtmlTableRow
   */
  constructor() {
    this.cells = [];
  } // end function constructor

  /**
   * Adds a cell to the row
   *
   * @param text The cell's text
   * @param colspan The cell's colspan
   */
  addCell(text: string, colspan: number = 1): void {
    let cell = new HtmlTableCell(text);
    if (colspan > 1) {
      cell.colspan = colspan;
    } // end if colspan > 1

    //  Add the cell to the list
    this.cells.push(cell);
  } // end function addCell
} // end interface html table row

export class HtmlTable {
  rows: HtmlTableRow[];

  constructor() {
    this.rows = [];
  } // end function constructor

  addRow(row: HtmlTableRow): void {
    this.rows.push(row);
  } // end function add row

  newRow(): HtmlTableRow {
    return new HtmlTableRow();
  } // end function new row

  /**
   * Returns an string with html of the table
   */
  toString(): string {
    let html: string = "<table>";

    for (let row of this.rows) {
      html += "<tr>";
      for (let cell of row.cells) {
        html += `<td colspan="${cell.colspan}">`;
        html += cell.text;
        html += "</td>";
      } // end for each column
      html += "</tr>";
    } // end for each row
    html += "</table>";
    return html;
  } // end function to string
} // end interface html table

@Component({
  selector: 'app-index-dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: [    
    '../plant-capacity/plant-capacity.component.scss',
    './dashboard.component.scss']
})
export class DashboardComponent extends PlantCapacityComponent implements AfterViewInit {
  @ViewChild('rcccMatrix') rcccMatrix: ElementRef;

  //    My product types
  private productTypes: ProductType[];
  //      The product
  private productType: ProductType;
  //    The items to show the chart
  private items: ICapacityReport[];
  private fleetItems: any[];

  private rows: IMatrixRow[];
  private fleetRows: IMatrixRow[];

  private businessUnits: string[];
  private materialTypes: string[];

  //      Message dialog message
  private messageText: string;

  //  Setup the view type
  private viewType: string = 'header'; // header | detail

  //  To generate fake data
  private testing: boolean = false;

  //  This variable will hold the row selected from the matrix
  private recordTable: Array<any> = [];

  //  This variable will hold the detail table
  private customerTypeTable: Array<any> = [];

  //    Capacity items
  private fleetCapacityItems: IFleetCapacityReportItem[] = [];

  //  The url to export
  private exportUrl: string = "";

  public disabledDates: Date[] = [];
  public disabledWeekDays = [];

  // Country Settings
  private countrySettings : ICountrySettings = null;

  /**
   * Creates an instance of DailyPlantCapacityComponent
   *
   * @param injector Injector
   */
  constructor(
    injector: Injector,
    private sanitizer: DomSanitizer
  ) {
    super(injector);
  } // end constructor

  /**
   * On component destruction, unsubscribe
   */
  ngOnDestroy() {
  } // end on destroy

  /**
   * Trigger when view is init
   */
  ngAfterViewInit() {
  } // end function after view init

  /**
   * Initiates the component
   */
  ngOnInit() {
    this.onInit();

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.getCountrySettings();
    }

    this.titleLanguageKey = 'views.sidebar.rccc.menues.index_dashboard';

    this.getAvailabilityInquiriesItems();
    this.session.menuApplicationItems.subscribe(
      result => {
        // Here we change the calendar tags, if change language
      }
    );
  } // end function ngOnInit

  /**
   * Get the country settings
   */
  private getCountrySettings(): void {
    if (this.versionToggle.isSettingsEnabled()) {
      this.api.getCountrySettings(sessionStorage.getItem('country')).subscribe(
        result => {
          this.countrySettings = result;

          this.countrySettings.calendar.nonWorkingDays.forEach(nwd => {
            let numbers = nwd.split('-');
            this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1])-1, Number(numbers[2])));
          });

          for (let index = 0; index < 7; index++) {
            if (this.checkIfDateIsDisabled(this.countrySettings.calendar.workingDays, index)) {
              this.disabledWeekDays.push(index);
            }
          }
        },
        error => this.showMessage(this.translate('rccc.settings.business_unit.errors.get_country_error_settings'))
      ); // end api get country settings
    } // end if isSettingsEnabled
  } // end function getCountrySettings

  checkIfDateIsDisabled(calendar: number, position: number) {
    let binary: number[] = new Array(7);

      let n = calendar;
      let value = 64
      for (let i = 0; i < binary.length; i++) {
        if (n >= value) {
          binary[i] = 1;
          n -= value;
        }
        else {
          binary[i] = 0;
        }

        value /=2;
      }

      return binary[6-position] != 1;
  }

  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  private pickFromDate(dateSelection: any): void {

    this.setFromDate(dateSelection);
    this.onPickDate();
  } // end function pickDate

  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  private pickToDate(dateSelection: any): void {

    this.setToDate(dateSelection);
    this.onPickDate();
  } // end function pickDate

  /**
   * Retrives distinct values from an array, according to a key
   */
  distinctObject (arr: Array<any>, keys: Array<string>): Array<any> {

    if (typeof arr == 'undefined') {
      console.error(`Undefined array in groupBy`);
      return null;
    } // end if xs undefined

    let result: Array<any> = [];

    for (let item of arr) {
      let obj: any = {};
      for (let key of keys) {
        obj[key] = item[key];
      } // end for

      if (result.length == 0) {
        result.push(obj);
        continue;
      } // end if

      let isPresent: boolean = false;
      for (let r of result) {
        if (JSON.stringify(r) == JSON.stringify(obj)) {
          isPresent = true;
        } // end if
      } // end for each r

      if (!isPresent) {
        result.push(obj);
      } // end if not is present
    } // end for each item of array

    return result;
  } // end function distinct

  /**
   * Retrives distinct values from an array, according to a key
   */
  distinct (arr: Array<any>, key: string): Array<any> {
    if (typeof arr == 'undefined') {
      console.error(`Undefined array in groupBy, key ${key}`);
      return null;
    } // end if xs undefined

    let result: Array<any> = [];
    for (let item of arr) {
      if (result.indexOf(item[key]) == -1) {
        result.push(item[key]);
      } // end if
    } // end for each item of array

    return result;
  } // end function distinct

  /**
   * Retrieves the availability inquiries items
   */
  getAvailabilityInquiriesItems(): void {

    //  Validate fromDate and toDate
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      this.showBarMessage(this.translate('digital_confirmation.warnings.fromDate_bigger_than_toDate'), 'warning');
      return;
    } // end if

    //  Set awaiting
    this.api.await();
    this.api.getAvailabilityInquiriesItems(this.fromDate, this.toDate).subscribe(
      response => {
        this.updateItems(response);
        if (this.api.showFleetConfirmation()) {
          this.updateFleetItems();
        } else {
          this.api.stopWaiting();
        }// end if show fleet confirmation
      }, // end on response
      error => {
        console.error(error);
        this.api.stopWaiting();
      } // end on error
    );
  } // end function get availability inquiries

  /**
   * Shows a confim dialog
   *
   * @param message The message to show
   */
  showMessage(message: string) {
    this.messageText = message;
  } // end function showMessage

  /**
   * Return the sum for a number property in an array
   *
   * @param items Array The array to calculate for
   * @param property string The property name
   *
   */
  private sum(items: Array<any>, property: string) {
    return items.map(
      x => x[property]
    ).reduce(
      (a, c) => a + c, 0
    ); // end tonRate
  } // end function sum

  /**
   * Updates the item in the variable
   */
  private updateItems(items: any): void {

    if (items.length == 0) {
      this.showBarMessage(this.translate('digital_confirmation.warnings.no_data'), 'warning');
      return;
    } // if no data

    this.items = items;
    this.businessUnits = this.distinct(this.items, "businessUnitDesc");
    this.materialTypes = this.distinct(this.items, "materialTypeDesc");
    let tonsRate: number = 0;
    let loadsRate: number = 0;
    let loadsOffered: number;
    let loadsCommitted: number;
    let tonsOffered: number;
    let tonsCommitted: number;
    let filteredItems: ICapacityReport[];

    this.rows = [];
    for (let i in this.businessUnits) {

      let businessUnitDesc = this.businessUnits[i];
      let columns: IMatrixColumn[] = [];
      for (let materialTypeDesc of this.materialTypes) {

        filteredItems = this.items.filter(
          item => item.businessUnitDesc == businessUnitDesc && item.materialTypeDesc == materialTypeDesc
        );

        tonsOffered = this.sum(filteredItems, "tonsOffered");
        loadsOffered = this.sum(filteredItems, "loadsOffered");
        tonsCommitted = this.sum(filteredItems, "tonsCommitted");
        loadsCommitted = this.sum(filteredItems, "loadsCommitted");
        tonsRate = (tonsOffered == 0) ? 0 : Math.floor((tonsCommitted * 100) / tonsOffered);
        loadsRate = (loadsOffered == 0) ? 0 : Math.floor((loadsCommitted * 100) / loadsOffered);

        if (this.testing) {
          tonsRate = Math.floor(Math.random() * 100);
          loadsRate = Math.floor(Math.random() * 100);
        } // end if testing

        let values: IMatrixValue[] = [];
        values.push({
          title: this.translate('rccc.views.labels.indicators.tn'),
          value: `${tonsRate}%`,
          indicatorLevel: this.getIndicatorLevel(tonsRate),
        });
        values.push({
          title: this.translate('rccc.views.labels.indicators.ld'),
          value: `${loadsRate}%`,
          indicatorLevel: this.getIndicatorLevel(loadsRate),
        });

        columns.push({
          title: this.translate('rccc.catalogs.fleet_type_bu.material_type'),
          text: materialTypeDesc,
          values: values
        });
      } // end for each material types

      this.rows.push({
        title: this.translate('rccc.catalogs.fleet_type_bu.business_unit'),
        text: businessUnitDesc,
        alternate: (parseInt(i) % 2 > 0),
        columns: columns
      });
    } // end for each plants

    this.export();
  } // end function updateItems

  /**
   * Get the indicator level corresponding to the rate
   *
   * @param rate Number The rate to eval
   *
   * @return number
   */
  private getIndicatorLevel(rate: number): number {
    let result = 1;

    if (rate >= 60) {
      result = 2;
    } // end if rate >= 60

    if (rate >= 80) {
      result = 3;
    } // end if rate >= 80

    return result;
  } // end function get indicator level

  private showDetail(businessUnitDesc: string, materialTypeDesc: string) {
    let tonsRate: number = 0;
    let loadsRate: number = 0;
    let loadsOffered: number;
    let loadsCommitted: number;
    let tonsOffered: number;
    let tonsCommitted: number;

    let filteredItems: ICapacityReport[] = this.items.filter(
      item => item.businessUnitDesc == businessUnitDesc && item.materialTypeDesc == materialTypeDesc
    );

    tonsOffered = this.sum(filteredItems, "tonsOffered");
    loadsOffered = this.sum(filteredItems, "loadsOffered");
    tonsCommitted = this.sum(filteredItems, "tonsCommitted");
    loadsCommitted = this.sum(filteredItems, "loadsCommitted");
    tonsRate = (tonsOffered == 0) ? 0 : Math.floor((tonsCommitted * 100) / tonsOffered);
    loadsRate = (loadsOffered == 0) ? 0 : Math.floor((loadsCommitted * 100) / loadsOffered);

    if (this.testing) {
      tonsRate = Math.floor(Math.random() * 100);
      loadsRate = Math.floor(Math.random() * 100);
    } // end if testing

    //  Get the customer types
    let customerTypes = this.distinct(filteredItems, "customerType");
    if ((this.countrySettings) && (this.countrySettings.shippingConditions)) {
      let shippingConditionsKeys = this.countrySettings.shippingConditions.map(sc => sc.shippingConditionDesc);
      customerTypes = customerTypes.filter(ct => shippingConditionsKeys.includes(ct));
    } // end if country settings and shipping conditions

    //  Setup the record table (header data for the detail view
    this.recordTable = [{
      businessUnitDesc,
      materialTypeDesc,
      tonsRate,
      loadsRate,
      tonsIndicatorLevel: this.getIndicatorLevel(tonsRate),
      loadsIndicatorLevel: this.getIndicatorLevel(loadsRate)
    }];

    //  Re-initialize the customer type table
    this.customerTypeTable = [];

    for (let customerType of customerTypes) {
      let customerTypeItems: ICapacityReport[] = filteredItems.filter(
        item => item.customerType == customerType
      );

      tonsOffered = this.sum(customerTypeItems, "tonsOffered");
      loadsOffered = this.sum(customerTypeItems, "loadsOffered");
      tonsCommitted = this.sum(customerTypeItems, "tonsCommitted");
      loadsCommitted = this.sum(customerTypeItems, "loadsCommitted");
      let customerTypeTonsRate: number = (tonsOffered == 0) ? 0 : Math.floor((tonsCommitted * 100) / tonsOffered);
      let customerTypeLoadsRate: number = (loadsOffered == 0) ? 0 : Math.floor((loadsCommitted * 100) / loadsOffered);

      if (this.testing) {
        customerTypeTonsRate = Math.floor(Math.random() * 100);
        customerTypeLoadsRate = Math.floor(Math.random() * 100);
      } // end if testing

      this.customerTypeTable.push({
        customerTypeDesc: this.translate(customerType),
        tonsRate: customerTypeTonsRate,
        loadsRate: customerTypeLoadsRate,
        tonsIndicatorLevel: this.getIndicatorLevel(customerTypeTonsRate),
        loadsIndicatorLevel: this.getIndicatorLevel(customerTypeLoadsRate)
      }); // end customer type table push
    } // end for each customer type

    this.viewType = 'detail';
  } // end function showDetail

  private backToHeader() {
    this.viewType = 'header';
  } // end function
  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  protected onPickDate() {
    this.getAvailabilityInquiriesItems();
    this.showDatePicker = false;
  } // end function on pickDate

  /**
   * Update fleet items
   */
  private updateFleetItems() {

    //  Setup the plants
    let businessUnits: IBusinessUnit[] = this.distinctObject(this.items, ["businessUnitId", "businessUnitDesc"]);

    if (!businessUnits || businessUnits.length == 0) {
      console.warn("No business units. Stop update fleet items.");
      this.api.stopWaiting();
      return;
    } // end if no business units

    //  Call fleet capacity dashboard items api
    this.api.getFleetCapacityDashboardItems(this.fromDate, this.toDate).subscribe(
      response => {
        this.fleetCapacityItems = response;
        //  Initialize fleet items
        this.fleetItems = [];
        //  Loop fleet capacity items
        for (let item of this.fleetCapacityItems) {
          //  Insert the record
          this.fleetItems.push({
            fleetTypeDesc: item.fleetTypeDesc.split('-')[0],
            businessUnitDesc: item.businessUnitDesc,
            offeredUnits: item.offeredUnits,
            committedUnits: item.committedUnits
          }); // end push
        } // end for item

        this.updateFleetItemsRows(businessUnits);
      }, // end anonymous response on success
      error => {
        this.fleetCapacityItems = [];
        this.showBarMessage(error, 'error');
      } // end on error
    ); // end get fleet capacity dashboard items
  } // end function update fleet items

  /**
   * This method actually updates the matrix data
   *
   * @param businessUnits The business units to update
   *
   * @return void
   */
  private updateFleetItemsRows(businessUnits: IBusinessUnit[]) {
    this.fleetRows = [];
    let fleetTypes: string[] = this.distinct(this.fleetItems, "fleetTypeDesc");

    for (let i in businessUnits) {

      let businessUnitDesc = businessUnits[i].businessUnitDesc;
      let columns: IMatrixColumn[] = [];

      for (let fleetTypeDesc of fleetTypes) {

        let filteredItems: Array<any> = this.fleetItems.filter(
          item => item.businessUnitDesc == businessUnitDesc && item.fleetTypeDesc == fleetTypeDesc
        );

        let unitsOffered: number = this.sum(filteredItems, "offeredUnits");
        let unitsCommitted: number = this.sum(filteredItems, "committedUnits");
        let unitsRate: number = (unitsOffered == 0) ? 0 : Math.floor((unitsCommitted * 100) / unitsOffered);

        if (this.testing) {
          unitsRate = Math.floor(Math.random() * 100);
        } // end if testing

        let values: IMatrixValue[] = [];
        values.push({
          title: this.translate('rccc.views.labels.indicators.units'),
          value: `${unitsRate}%`,
          indicatorLevel: this.getIndicatorLevel(unitsRate),
        });

        columns.push({
          title: this.translate('rccc.catalogs.fleet_type_bu.fleet_type'),
          text: fleetTypeDesc,
          values: values
        });
      } // end for each material types

      this.fleetRows.push({
        title: this.translate('rccc.catalogs.fleet_type_bu.business_unit'),
        text: businessUnitDesc,
        alternate: (parseInt(i) % 2 > 0),
        columns: columns
      });
    } // end for each plants
    this.api.stopWaiting();
  } // end function update fleet items rows

  /**
   * Returns the matrix table in html for the rccc matrix
   */
  getMatrixHtmlTable(): string {

    let table: HtmlTable = new HtmlTable();
    let row: HtmlTableRow = table.newRow();

    row.addCell("");

    for (let column of this.rows[0].columns) {
      row.addCell(column.text, column.values.length);
    } // end for each column

    table.addRow(row);
    row = table.newRow();
    row.addCell(this.rows[0].title);

    for (let column of this.rows[0].columns) {
      for (let value of column.values) {
        row.addCell(value.title);
      } // end for each value
    } // end for each column

    table.addRow(row);
    for (let drow of this.rows) {
      row = table.newRow();
      row.addCell(drow.text);
      for (let column of drow.columns) {
        for (let value of column.values) {
          row.addCell(value.value);
        } // end for each value
      } // end for each column
      table.addRow(row);
    } // end for each row

    return table.toString();
  } // end function get matrix html table

  sanitize(url:string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  export(): void {
    let blob = new Blob(
      [this.getMatrixHtmlTable()], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );
    this.exportUrl = window.URL.createObjectURL(blob);
  } // end function void
} // end class DailyPlantCapacityComponent