import {
  Component, OnInit, Injector, OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { PlantCapacityComponent } from '../plant-capacity/plant-capacity.component';
import { IDailyPlantCapacityItem } from '../../models/daily-plant-capacity-item.interface';
import { Plant } from '../../models/plant';
import { ICustomerTypeCapacity } from '../../models/customer-type-capacity.interface';
import { BLUE_RED_PALETTE } from '../../data/blue-red-palette';
import { STACK_PALETTE } from '../../data/stack-palette';
import { ICapacityInquiryItem } from '../../models/capacity-inquiry-item.interface';
import { ISeriesItem } from '../../models/series-item.interface';
import { IHourlySeriesItem } from '../../models/hourly-series-item.interface';
import { ProductType } from '../../models/product-type';
import { DashPanelComponent }  from '../dash-panel/dash-panel.component';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
import { ICommercialManagement } from '../../models/commercial-management.interface';
import { ICustomer } from '../../models/customer.interface';
import { CUSTOMER_TYPE_PALETTE } from '../../data/customer-type-palette';
import { AlertService } from '@cemex/cmx-alert-v7';//updated from v2
import { ICountrySettings } from '../../models/country-settings.interface';
import { CmxDatepickerComponent } from '@cemex/cmx-datepicker-v4'; //v4 component

@Component({
  selector: 'app-daily-plant-capacity',
  templateUrl: './daily-plant-capacity.component.html',
  styleUrls: ['./daily-plant-capacity.component.scss']
})
export class DailyPlantCapacityComponent extends PlantCapacityComponent {

  //    My product types
  private productTypes: ProductType[];
  //      The product
  private productType: ProductType;
  //    Commercial management list
  commercialManagementItems: ICommercialManagement[];
  //    Customers List
  customersItems: ICustomer[];
  //    The commercial management
  commercialManagement: ICommercialManagement;
  //    The Customer selected
  customer: ICustomer;

  //  This properties are used to placeholder the dropdowns
  private selectedProductTypeDescription: string;
  private selectedCommercialManagementDescription: string;
  private selectedCustomerDescription: string;

  //    The items to show the chart
  private items: IDailyPlantCapacityItem[];
  private dailyPlantCapacityItems: ICapacityInquiryItem[];
  private customerTypeCapacityItems: ICustomerTypeCapacity[];
  private hourlyItems: IHourlySeriesItem[];
  private hourlyLoadsItems: IHourlySeriesItem[];

  private customerTypePalette = CUSTOMER_TYPE_PALETTE;
  private stackPalette = STACK_PALETTE;
  private capacityInquiryItem: ICapacityInquiryItem;
  private dailyPlantCapacityItemNumber = 0;
  private pieLegend: string;

  // Timer & subscription
  private timer: any;
  private sub: Subscription;
  private interval = 10000;

  // Country Settings
  private countrySettings = new ICountrySettings();
  public disabledDates: Date[] = [];
  public disabledWeekDays = [];

  //  ViewChilds Dialogs
  @ViewChildren(CmxDialogComponent) dialogs: QueryList<CmxDialogComponent>;
  @ViewChild('datepicker') datePicker: CmxDatepickerComponent;
  private messageDialog: CmxDialogComponent;
  //      Message dialog message
  private messageText: string;
  //  Indicates if extended filters are activated
  private isFiltersToggled: boolean = false;
  // Commercial Management Indicators
  private haveCommercialManagement: boolean = false;

  constructor(
    injector: Injector,
    private alertService: AlertService
  ) {
    super(injector);
  }

  /**
   * On component destruction, unsubscribe
   */
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    } // end this sub
  } // end on destroy

  /**
   * Initiates the component
   */
  ngOnInit() {
    this.onInit();
    // this.selectedProductTypeDescription = this.translate('rccc.admin.selected_material_type_label');
    // this.selectedCommercialManagementDescription = this.translate('rccc.admin.selected_commercial_management_label');
    // this.selectedCustomerDescription = this.translate('rccc.admin.selected_customer_label');
    // this.titleLanguageKey = 'rccc.daily_plant_capacity.title';
    // this.pieLegend = 'rccc.daily_plant_capacity.pie_legend';

    //  Set awaiting
    this.api.await();

    this.selectedProductTypeDescription = this.translate('rccc.admin.selected_material_type_label');
    this.selectedCommercialManagementDescription = this.translate('rccc.admin.selected_commercial_management_label');
    this.selectedCustomerDescription = this.translate('rccc.admin.selected_customer_label');
    this.titleLanguageKey = 'rccc.daily_plant_capacity.title';
    this.pieLegend = 'rccc.daily_plant_capacity.pie_legend';

    //  Get my plants
    this.getMyPlants();
    this.getCommercialManagementItems();
    this.getCustomers();

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.getCountrySettings();
    }

    this.api.getDailyPlantCapacityItemsStatus().subscribe(
      response => {
        if ((this.countrySettings) && (this.countrySettings.shippingConditions)) {
          let shippingConditionsKeys = this.countrySettings.shippingConditions.map(sc => sc.shippingConditionDesc);
          shippingConditionsKeys.push('total');
          response = response.filter(ct => shippingConditionsKeys.includes(ct.customerType));
        } // end if country settings and shipping conditions
        this.dailyPlantCapacityItems = response;
        this.updateItems();
        this.api.stopWaiting();
      }, // end on response
      error => alert(error)
    ); // end subscribe

    this.api.getCustomerTypeCapacityItemsStatus().subscribe(
      response => {
        if ((this.countrySettings) && (this.countrySettings.shippingConditions)) {
          let shippingConditionsKeys = this.countrySettings.shippingConditions.map(sc => sc.shippingConditionDesc);
          shippingConditionsKeys.push('total');
          response = response.filter(ct => shippingConditionsKeys.includes(ct.customerType));
        } // end if country settings and shipping conditions

        response.map(ct => { ct.customerType = this.translate(ct.customerType); });
        this.customerTypeCapacityItems = response;
        this.verifyCustomerTypeCapacityItems();
        this.api.stopWaiting();
      }, // end on response
      error => alert(error)
    ); // end subscribe

    //  Setup the timer
    /*
    this.timer = Observable.timer(this.interval, this.interval);
    this.sub =
      this.timer.subscribe(
        t => {
          this.forwardItem();
        }, // end subcription
        error => alert(error)
      ); // end subcribe
    */

    this.session.menuApplicationItems.subscribe(
      result => {

        this.selectedPlantDescription = this.translate('rccc.admin.selected_plant_label');
        this.selectedProductTypeDescription = this.translate('rccc.admin.selected_material_type_label');
        if ((result.length) && (this.plant) && (this.productTypes)) {
          this.getProductTypes(this.plant);
        } // end if result & plant & productType
      }
    );
  } // end function ngOnInit


  updateDatePicker() {
    this.updatePicker(this.datePicker, this.disabledDates);
  }

  /**
   * Verify there's data
   *
   */
  private verifyCustomerTypeCapacityItems() {
    const reducer = (accum: any, current: any) => accum + current;
    let offered = this.customerTypeCapacityItems.map(item => item.tonsOffered).reduce(reducer);
    if (offered == 0) {
      this.customerTypeCapacityItems = [];
    } // end if offered is 0
  } // end function verifyCustomerTypeCapacityItems

  /**
   * Verify there's data
   */
  private verifyHourlyItems() {
    const reducer = (accum: any, current: any) => accum + current;
    let value =
      this.hourlyItems.map(
        item => item.data.map(
          dItem => dItem.value
        ).reduce(reducer)
      ).reduce(reducer);

    if (value == 0) {
      this.hourlyItems = [];
    } // end if value is 0
  } // end function verifyHourlyItems

  /**
   * Updates the item in the variable
   */
  private updateItems() {

    if (this.dailyPlantCapacityItems) {
      if (this.dailyPlantCapacityItems.length == 0) {
        this.items = [];
        this.hourlyItems = [];
        this.hourlyLoadsItems = [];
      } else {
        this.items = this.dailyPlantCapacityItems[this.dailyPlantCapacityItemNumber]["dailyData"];
        this.hourlyItems = this.dailyPlantCapacityItems[this.dailyPlantCapacityItemNumber]["hourlyData"];
        this.hourlyLoadsItems = this.dailyPlantCapacityItems[this.dailyPlantCapacityItemNumber]["hourlyLoadsData"];
      } // end if dailyPlantCapacityItems
      this.capacityInquiryItem = this.dailyPlantCapacityItems[this.dailyPlantCapacityItemNumber];
    } // end if dailyPlantCapacityItems
  } // end function updateItems

  /**
   * Goes forward 1 number in daily capacity items
   */
  private forwardItem() {
    if (this.dailyPlantCapacityItems) {
      if (
        (this.dailyPlantCapacityItems) &&
        (this.dailyPlantCapacityItemNumber == (this.dailyPlantCapacityItems.length - 1))
      ) {
        this.dailyPlantCapacityItemNumber = 0;
      } else {
        this.dailyPlantCapacityItemNumber++;
      } // else if upper limit

      this.updateItems();
    } // if dailyPlantCapacityItems
  } // end function backwardItem

  /**
   * Goes back 1 number in daily capacity items
   */
  private backwardItem() {
    if (this.dailyPlantCapacityItemNumber == 0) {
      this.dailyPlantCapacityItemNumber = this.dailyPlantCapacityItems.length - 1;
    } else {
      this.dailyPlantCapacityItemNumber--;
    } // else if upper limit

    this.updateItems();
  } // end function backwardItem

  getCountrySettings() {
    this.api.getCountrySettings(sessionStorage.getItem('country')).subscribe(
      result => {
        this.countrySettings = result;

        this.countrySettings.calendar.nonWorkingDays.forEach(nwd => {
          let numbers = nwd.split('-');
          this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1]) - 1, Number(numbers[2])));
        });

        for (let index = 0; index < 7; index++) {
          if (this.checkIfDateIsDisabled(this.countrySettings.calendar.workingDays, index)) {
            this.disabledWeekDays.push(index);
          }
        }
      },
      error => this.alertService.openError(this.translate('rccc.settings.business_unit.errors.get_country_error_settings'),
        this.translate('rccc.errors.try_again_later'), 5000)
    );
  }

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

      value /= 2;
    }

    return binary[6 - position] != 1;
  }

  /**
   * Get the product type from my plants
   *
   * @param plant The plant to search
   */
  getProductTypes(plant) {
    //  Set awaiting
    this.api.await();
    this.haveCommercialManagement = false;
    this.plant = plant;
    this.selectedPlantDescription = `${this.plant.plantCode} - ${this.plant.plantDesc}`;

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.api.getBusinessUnitSettings(sessionStorage.getItem('country'), this.plant.plantCode).subscribe(
        response => {
          if (response) {
            this.productTypes = response.productTypes;
            this.productTypes.map(pt => pt.productTypeDesc = this.translate(pt.productTypeDesc));
            this.disabledDates = [];
            this.disabledWeekDays = [];
            this.haveCommercialManagement = response.commercialManagement;

            response.calendar.nonWorkingDays.forEach(nwd => {
              let numbers = nwd.split('-');
              this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1]) - 1, Number(numbers[2])));
            });

            for (let index = 0; index < 7; index++) {
              if (this.checkIfDateIsDisabled(response.calendar.workingDays, index)) {
                this.disabledWeekDays.push(index);
              }
            }
          } else {
            this.productTypes = this.countrySettings.productTypes;
          }

          if (this.productType) {
            //  Get the product type, translated
            let productType =
              this.productTypes.filter(
                productType => productType.productTypeId == this.productType.productTypeId
              )[0];

            if (productType) {
              //  Query the capacities
              this.queryDailyPlantCapacity(productType);
            } else {
              this.items = [];
              this.hourlyItems = [];
              this.hourlyLoadsItems = [];
              this.api.stopWaiting();
            } // end if productType
          } else {
            this.api.stopWaiting();
          }// end if this.productType
        },
        error => this.alertService.openError(this.translate('rccc.settings.business_unit.errors.get_business_unit_error_settings'),
          this.translate('rccc.errors.try_again_later'), 5000)
      );
    } else {
      // v1
      this.api.getProductTypes(this.plant.plantId).subscribe(
        response => {
          this.productTypes = response;
          if (this.productType) {
            //  Get the product type, translated
            let productType =
              this.productTypes.filter(
                productType => productType.productTypeId == this.productType.productTypeId
              )[0];

            if (productType) {
              //  Query the capacities
              this.queryDailyPlantCapacity(productType);
            } else {
              this.items = [];
              this.hourlyItems = [];
              this.hourlyLoadsItems = [];
              this.api.stopWaiting();
            } // end if productType
          } else {
            this.api.stopWaiting();
          }// end if this.productType
        },
        error => {
          this.alertService.openError(this.translate('rccc.settings.business_unit.errors.get_product_types_error_settings'),
            this.translate('rccc.errors.try_again_later'), 5000);
        }
      ); // end subscribe
    }
  } // end getProductTypes function

  /**
   * Query daily plant capacity
   *
   * @param plant The plant to query
   */
  private queryDailyPlantCapacity(productType: ProductType) {

    if (this.datePickerError) {
      this.showBarMessage(this.translate('rccc.errors.sunday_error'), "error");
      return;
    } // end if date picker error

    this.api.await();
    this.productType = productType;
    this.selectedProductTypeDescription = `${this.productType.productTypeCode} - ${this.productType.productTypeDesc}`;
    this.api.queryDailyPlantCapacity(this.plant, this.productType, this.date, this.commercialManagement);
  } // end function quertDailyPlantCapacity

  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  protected onPickDate() {
    if (this.productType && this.plant) {
      this.queryDailyPlantCapacity(this.productType);
      this.showDatePicker = false;
    } // end if this.plant
  } // end function on pickDate

  /**
   * Show the filters, if thery're hidden
   */
  private toggleFilters() {
    if (this.isFiltersToggled) {
      if (((this.commercialManagement) && this.commercialManagement.commercialManagementCode != "") || ((this.customer) && (this.customer.customerId > -1))) {
        return;
      } // end if commercial management or customer
      this.isFiltersToggled = !this.isFiltersToggled;
    } else {
      this.isFiltersToggled = !this.isFiltersToggled;
    } // end if not is filters toggled
  } // end function toggle filters

  /**
   * getCustomers
   */
  getCustomers() {
    this.api.GetCustomers().subscribe(x => {
      this.customersItems = x;
    });
  } // end function get customers

  /**
   * Retrives the commercial management list from the server api
   */
  getCommercialManagementItems(): void {
    this.api.await();
    this.api.getCommercialManagementItems().subscribe(
      response => {
        this.commercialManagementItems = response;
        this.api.stopWaiting();
      }, // end on success
      error => {
        this.alertService.openError(this.translate('rccc.catalogs.error.getCommercialManagementItems'), this.translate('rccc.errors.try_again_later'), 5000);
        // this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
      } // end on error
    ); // end api get commercial management list subscribe
  } // end function get commercial management list


  /**
   * Get the capacities using the commercial management tool
   *
   * @param cm ICommercialManagement The commercial management to set
   *
   */
  setCommercialManagement(commercialManagement: ICommercialManagement): void {
    try {
      if (!commercialManagement) {
        throw new Error(this.translate("digital_confirmation.daily_plant_capacity.commercial_management"));
      } // end if not commercial management

      this.commercialManagement = commercialManagement;
      this.selectedCommercialManagementDescription = commercialManagement.commercialManagementCode;

      if (this.productType) {
        //  Query the capacities
        this.queryDailyPlantCapacity(this.productType);
      } // end if product type
    } catch (err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
      // this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);

    } // end try catch
  } // end function get capacity by commercial management

  /**
   * setCustomer
   */
  public setCustomer(customer: ICustomer): void {
    try {
      if (!customer) {
        throw new Error("digital_confirmation.daily_plant_capacity.errors.customer");
      }

      this.customer = customer;
      this.selectedCustomerDescription = customer.customerDesc;

      if (this.productType) {
        //  Query the capacities
        this.queryDailyPlantCapacity(this.productType);
      } // end if product type

    } catch (err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
    }
  } // end function set customer

  /**
   * Set the product type
   *
   * @param productType The product type to query for capacities
   */
  setProductType(productType: ProductType) {
    try {
      if (productType === null || typeof productType == 'undefined') {
        throw new Error(this.translate("digital_confirmation.daily_plant_capacity.product_type_not_set"));
        // throw new Error("Product type is not set");
      } // end if product type

      //  Set the product type
      this.productType = productType;

      //  Set the description
      this.selectedProductTypeDescription = `${this.productType.productTypeCode} - ${this.productType.productTypeDesc}`;

      //  Query the capacities
      this.queryDailyPlantCapacity(this.productType);
    } catch (err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
    } // end try catch
  } // end function getCapacityItems
} // end class DailyPlantCapacityComponent