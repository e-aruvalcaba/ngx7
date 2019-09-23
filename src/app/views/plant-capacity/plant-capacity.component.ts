import { Component, OnInit, Injector } from '@angular/core';
import { CnxGblOrgService } from '../../services/cnx-gbl-org.service';
import { SessionService } from '@cemex-core/angular-services-v7'; //updated from v2
import { TranslationService } from '@cemex-core/angular-localization-v7'; //updated from v1
import { StringHelperService } from '../../services/string-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@cemex/cmx-alert-v7'; //updated from v2

import { Plant } from '../../models/plant';
import { IAppMenu } from '../../models/app-menu.interface';

import { RCCC_APP_MENUES } from '../../data/rccc-app-menues';
import { RCCC_NAVBAR_ITEMS } from '../../data/rccc-navbar-items';
import { DatepickerTags, CmxDatepickerComponent } from '@cemex/cmx-datepicker-v4/dist';
import { VersionToggle } from '../../services/versionToggle.service';

@Component({
  selector: 'app-plant-capacity',
  // templateUrl: './plant-capacity.component.html',
  styleUrls: ['./plant-capacity.component.scss']
})
export class PlantCapacityComponent {


  //  Properties
  //    The services
  protected api: CnxGblOrgService;
  protected versionToggle: VersionToggle;
  protected ts: TranslationService;
  protected stringHelper: StringHelperService;
  protected session: SessionService;
  protected route: ActivatedRoute;
  protected router: Router;
  protected alert: AlertService;

  //  Data
  protected rcccAppMenues: IAppMenu[];
  protected navBarItems: IAppMenu[];

  //    My plants
  protected myPlants: Plant[];

  //  This properties are used to placeholder the dropdowns
  protected selectedPlantDescription: string;
  //  This property holds the title
  protected titleLanguageKey: string;

  //    The properties for the filter
  //      The plant
  protected plant: Plant;
  //      The date
  protected date: Date = new Date();
  protected formattedDate: string;
  //      The date for cloning
  protected fromDate: Date;
  protected formattedFromDate: string;
  protected toDate: Date;
  protected formattedToDate: string;

  //  Indicates there's an error in date picker
  protected datePickerError: boolean = false;

  public months: string[];
  protected days: string[];
  public monthsShort: string[];
  public daysShort: string[];
  public datepickerTags: DatepickerTags;

  protected showDatePicker: boolean = false;
  protected showDatePickerCloneInitial: boolean = false;
  protected showDatePickerCloneFinal: boolean = false;
  protected cloneModelErrorText: string;
  public cloneModelValidation: boolean=false;

  /**
   * Creates an instance of PlantCapacityComponent
   *
   * @param injector Injector
   */
  constructor(
    injector: Injector
  ) {
    this.api = injector.get(CnxGblOrgService);
    this.versionToggle = injector.get(VersionToggle);
    this.ts = injector.get(TranslationService);
    this.stringHelper = injector.get(StringHelperService);
    this.session = injector.get(SessionService);
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.alert = injector.get(AlertService);
    this.months = window["CMX_LANGUAGES"].filter(l => l.languageISO == sessionStorage.getItem("language"))[0].monthNames.split(",");
    this.days = window["CMX_LANGUAGES"].filter(l => l.languageISO == sessionStorage.getItem("language"))[0].dayNames.split(",");
    this.monthsShort = this.months.map(m => m.substring(0, 3));
    this.daysShort = this.days.map(m => m.substring(0, 3));
    this.datepickerTags =
      new DatepickerTags(
        this.translate('views.global.btn_cancel'),
        this.translate('views.global.btn_confirm'),
        this.months,
        this.monthsShort,
        this.daysShort
      );
  } // end constructor

  /**
   * To call on init in child components
   */
  protected onInit() {
    debugger;
    console.log("PLANT CAPACITY INICIALIZADO");
    console.log(this.api);
    this.date = this.toDate = this.fromDate = new Date();
    this.formattedDate = this.formattedFromDate = this.formattedToDate = this.stringHelper.formatDate(this.date);
    this.datepickerTags = null;
    this.session.menuApplicationItems.subscribe(
      result => {
        this.datepickerTags =
          new DatepickerTags(
            this.translate('views.global.btn_cancel'),
            this.translate('views.global.btn_confirm'),
            this.months,
            this.monthsShort,
            this.daysShort
          );
        this.selectedPlantDescription = this.translate('rccc.admin.selected_plant_label');
      } // end anonymous menu applications subscribe
    ); // end subscribe
  } // end function ngOnInit

  /**
   * Gets myPlants from the api
   */
  protected getMyPlants() {
    //  Get my plants
    this.api.getMyPlants().subscribe(
      response => { this.myPlants = response; this.api.stopWaiting(); },
      error => { console.error(error); }
    ); // end subscribe
  } // end getMyPlants

  /**
   * Returns translation
   *
   * @param key The key to look for in the locales files
   *
   * @return string
   */
  protected translate(key: string): string {
    return this.ts.pt(key);
  } // end function translate

  /**
   * Navigates to home
   */
  protected navBarItemClick() {
    if (this.api.isEmptyObject(this.api.dataStorage)) {
      this.api.dataStorage = {
        appMenues: RCCC_APP_MENUES,
        navBarItems: RCCC_NAVBAR_ITEMS
      };
    } // end if this.api.dataStorage

    this.router.navigate(['/app/home']);
  } // end function navBarItemClick

  /**
   * Get Fixed section value, based in User Agent
  */
  public getFixedSectionLeftValue()
  {
    var userAgent = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent))
    {
      if(this.isIpadProPortrait())
      {
        return 450;
      }
      else if(this.isIpadProLandscape())
      {
        return 800;
      }
      else if(/iPad/i.test(userAgent))
      {
        return 15;
      }

      return 1;
    }

    return 1000;
  } // end function getFixedSectionLeftValue

  /**
  * Validate the Screen Definition to get the iPad Pro in Portrait Mode
  */
  private isIpadProPortrait()
  {
    return this.isIpadPro(1366, 1024);
  } // end isIpadPro

  /**
  * Validate the Screen Definition to get the iPad Pro in Landscape Model
  */
  private isIpadProLandscape()
  {
    return this.isIpadPro(1024, 1366);
  } // end isIpadProLandscape

  /**
  * Validate the Screen Definition to get the iPad Model
  */
  private isIpadPro(minHeight: number, minWidth: number)
  {
    if(/iPad/i.test(navigator.userAgent))
    {
      var height = window.outerHeight;
      var width = window.outerWidth;

      return height == minHeight && width == minWidth;
    }
    return false;
  } // end isIpadPro

  /**
   * On a valid pick date trigger this function
   */
  protected onPickDate(): void {
  } // end on pick date function

  private sundayConstraint(dateSelection: any): boolean {

    let country: string = this.api.getCurrentUserCountry();
    if (dateSelection.value.min.toLocaleDateString("en",{weekday: 'long'}).toLowerCase() == 'sunday' && country == 'MX') {
      this.datePickerError = true;
      this.showBarMessage(this.translate('rccc.errors.sunday_error'), "error");
      return true;
    } // end if sunday
    return false;
  } // end function sundayConstraint
  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  protected pickDate(dateSelection: any): void {
    if (this.sundayConstraint(dateSelection)) {
      return;
    } // end if sunday constraint
    this.datePickerError = false;
    this.date = dateSelection.value.min;
    this.formattedDate = this.stringHelper.formatDate(this.date);

    this.onPickDate();
  } // end function pickDate

  /**
   * Show bar message
   */
  protected showBarMessage(message: string, messageBoxType: string = 'info') {
    switch (messageBoxType) {
      case 'info':
        this.alert.openInfo(message, '', 2000);
      break;
      case 'error':
        this.alert.openError(message, '', 2000);
      break;
      case 'warning':
        this.alert.openWarning(message, '', 2000);
      break;
      case 'success':
        this.alert.openSuccess(message, '', 2000);
      break;
    } // end switch
    window.scrollTo(0,0);
  } // end show bar message

  // Fix bug on datepicker
  public updatePicker(picker:CmxDatepickerComponent, dates:Date[]){
    picker.disabledDates = dates;
    picker.cancelSelection();
    this.toggleDatePicker();
  }

  public updatePickerClone(picker:CmxDatepickerComponent, dates:Date[]){
    picker.disabledDates = dates;
    picker.cancelSelection();
    this.toggleDatePickerCloneInitial();
  }

  public updatePickerCloneFinal(picker:CmxDatepickerComponent, dates:Date[]){
    picker.disabledDates = dates;
    picker.cancelSelection();
    this.toggleDatePickerCloneFinal();
  }

  protected toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  } // end function

  protected cancelDatePicker() {
    this.showDatePicker = false;
  } // end function cancelDatePicker

  protected toggleDatePickerCloneInitial() {
    this.showDatePickerCloneInitial = !this.showDatePickerCloneInitial;
  } // end function

  protected toggleDatePickerCloneFinal() {
    this.showDatePickerCloneFinal = !this.showDatePickerCloneFinal;
  } // end function

  protected cancelDatePickerCloneInitial() {
    this.showDatePickerCloneInitial = false;
  } // end function cancelDatePicker

  protected cancelDatePickerCloneFinal() {
    this.showDatePickerCloneFinal = false;
  } // end function cancelDatePicker

  protected dateDiff(date1: Date, date2: Date): number {
    let result : number = Math.floor(
        (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) / (1000 * 60 * 60 * 24)
      ); // end Math.floor

    return result + 1;
  } // end dateDiff

  /**
   * Validates the inputs: Plant, material and dates
   */
  protected validateCopyModelDates() {

    let diff : number = this.dateDiff(this.fromDate, this.toDate);

    if (diff > 30) {
      this.cloneModelValidation = true;
      throw new Error(this.translate("rccc.clone_dialog.message.more_than_30_days"));
    } // end if diff >= 30

    this.cloneModelValidation = false;
  } // end function validateCopyModel

  /**
   * Sets the fromDate data
   * @param dateSelection The date object from wich to obtain and set the date
   */
  protected setFromDate(dateSelection: any) {
    this.cloneModelErrorText = "";
    this.fromDate = dateSelection.value.min;
    this.formattedFromDate = this.stringHelper.formatDate(this.fromDate);
    this.cancelDatePickerCloneInitial();
    try {
      this.validateCopyModelDates();
    } catch (ex) {
      this.cloneModelErrorText = ex;
    }
  } // end function setFromDate

  /**
   * Sets the toDate data
   * @param dateSelection The date object from wich to obtain and set the date
   */
  protected setToDate(dateSelection: any) {
    this.cloneModelErrorText = "";
    this.toDate = dateSelection.value.min;
    this.formattedToDate = this.stringHelper.formatDate(this.toDate);
    this.cancelDatePickerCloneFinal();
    try {
      this.validateCopyModelDates();
    } catch (ex) {
      this.cloneModelErrorText = ex;
    }
  } // end function setToDate
} // end class DailyPlantCapacityComponent