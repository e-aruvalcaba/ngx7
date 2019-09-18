import { Component, OnInit, ElementRef, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { PlantCapacityComponent } from '../../plant-capacity/plant-capacity.component';
import { ORDER_FULFILLMENT_APP_MENUES } from '../../../data/order-fulfillment-app-menues';
import { RCCC_APP_MENUES } from '../../../data/rccc-app-menues';
import { IAppMenu } from '../../../models/app-menu.interface';

import { FleetType } from '../../../models/fleet-type';
import { AlertService, AlertType } from '@cemex/cmx-alert-v7'; //updated from v4
// import { AlertType } from '@cemex/cmx-alert-v2/dist/models/alert'; 
import { forEach } from '@angular/router/src/utils/collection';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4

//-----------------------------------------------------------------------------------
//-------------------------  NEED TO FIX COMPONENT - NO SUPPORT FOR V7
// import { DATEPICKER_ENGLISH_SETUP } from '../../../data/datepicker-english-setup';
// import { DATEPICKER_SPANISH_SETUP } from '../../../data/datepicker-spanish-setup';
// import { IDatepickerSetup } from '@cemex/cmx-datepicker-v2';
import { StringHelperService } from '../../../services/string-helper.service';
import { Country, CountryEntity } from '../../../models/Country';
import { Holiday } from '../../../models/Holiday';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ComboMonth } from '../../../models/Month';
import { DatepickerInputComponent } from '@cemex/cmx-form-field-v4';

@Component({
  selector: 'holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})

export class HolidaysComponent extends PlantCapacityComponent {
  holidays: Holiday[];
  selectedHoliday: Holiday;
  countries: Country[];
  selectedCountry: Country;
  fleetTypes: FleetType[];
  selectedFleetType: FleetType;
  hasHolidays: boolean = false;
  // datepickerSetup: IDatepickerSetup = DATEPICKER_ENGLISH_SETUP; fixme
  formattedDate: string;
  dateFormat: string;
  date: Date;
  selectedCountryDescription: string = 'Country';
  holidayMonths: ComboMonth[];
  selectedMonth: ComboMonth;
  formGroup: FormGroup;
  holidayDate: FormControl;
  affectedDate: FormControl;
  name: FormControl;
  holidayDesc: FormControl;
  displayTabs: boolean;
  isEditingHoliday: boolean = false;

  // Message dialog message
  private messageText: string;
  private weekDays = this.translate('global.dayNames').split(',');
  private monthDays = this.translate('global.monthNames').split(',');

  @ViewChild('editorDialog') private editorDialog: CmxDialogComponent;
  @ViewChild('deleteHoliday') private deleteHoliday: CmxDialogComponent;
  @ViewChild('detailDialog') private detailDialog: CmxDialogComponent;
  @ViewChild('holidayDatePicker') private holidayDatePicker: DatepickerInputComponent;
  @ViewChild('affectionDatePicker') private affectionDatePicker: DatepickerInputComponent;

  ngOnInit() {
    this.date = new Date();
    this.onCreateForm();
    this.session.menuApplicationItems.subscribe(
      result => {
        
        
        // this.datepickerSetup = DATEPICKER_ENGLISH_SETUP; //fix me
        this.selectedCountryDescription = this.translate('rccc.settings.holidays.country');
        this.formattedDate = this.translate('rccc.settings.holidays.month');
        if (sessionStorage.getItem('language') == 'es_MX') {
          // this.datepickerSetup = DATEPICKER_SPANISH_SETUP;
          this.dateFormat = 'DD-MM-YYYY';
        } else {
          // this.datepickerSetup = DATEPICKER_ENGLISH_SETUP;
          this.dateFormat = 'MM-DD-YYYY';
        }  // end if language is es_MX
      } // end anonymous menu applications subscribe
    ); // end subscribe
    this.setup();

    //Set moment localization
    switch (sessionStorage.getItem('language').substring(0, 2)) {
      case 'es':
        this.setMoment("es"); //To set localization to holidays month on momentjs
      break;
    }
  } // end function oninit

  /**
   * loadCountries
   */
  private loadCountries() {
    this.api.getCountries().subscribe(countries => {
      countries = countries.filter(c => c.entryCode.trim() == sessionStorage.getItem('country'));
      countries.map(
        c => {
          c.entryDesc = c.entryCode.trim() + " - " + c.entryDesc.trim(); return c
        }
      ); // end map
      countries.splice(0, 0, {
        entryId: -1,
        entryCode: "",
        entryDesc: ""
      }); // end splice
      this.countries = countries;
    }, (error: any) => {
      console.error('loadCountries error');
      console.error(error);
      this.showBarMessage(this.translate('rccc.catalogs.message.errors.loading_countries'), 'error');
      // this.showBarMessage(this.translate('rccc.errors.generic_message'), 'error');
      this.api.stopWaiting();
    });
  } // end function load countries

  /**
   * setup
   */
  public setup() {
    // this.formattedDate = this.translate('rccc.settings.holidays.month');
    this.api.await();
    this.loadCountries();
    this.loadDisplayData(true);
    this.holidayMonths = this.GetMonths(this.date.getFullYear());
    this.api.stopWaiting();
  } // end function setup

  /**
   * Creates an instance of HolidaysComponent
   *
   * @param Injecto
   * @param formBuilder
   */
  constructor(
    injector: Injector,
    private formbuilder: FormBuilder
  ) {
    super(injector);
  } // end constructor

  /**
   * OnAddHoliday
   */
  public OnAddHoliday() {
    this.isEditingHoliday = false;
    let newHoliday = new Holiday();

    if (this.selectedMonth !== undefined) {
      let initialDate = new Date(this.selectedMonth.year, this.selectedMonth.month, 1);
      let finalDate = new Date(this.selectedMonth.year, this.selectedMonth.month + 1, 0);
      // this.affectionDatePicker.min = initialDate;
      // this.affectionDatePicker.max = finalDate;

      // this.holidayDatePicker.min = initialDate;
      // this.holidayDatePicker.max = finalDate;


      newHoliday.date.iso = moment(initialDate).format(this.dateFormat);
      newHoliday.affectedDate = moment(finalDate).format(this.dateFormat);
    } else {
      newHoliday.date.iso = moment().format(this.dateFormat);
      newHoliday.affectedDate = moment().format(this.dateFormat);
    }

    newHoliday.country = new CountryEntity();
    newHoliday.country.countryCode = this.selectedCountry.entryCode;
    newHoliday.country.countryDesc = this.selectedCountry.entryDesc;

    this.OnEditHoliday(newHoliday);
  }

  /**
   * OnEditHoliday
   */
  public OnEditHoliday(holiday: Holiday): void {
    this.isEditingHoliday = true;
    this.selectedHoliday = holiday;

    if (holiday.holidayId > 0) {
      this.holidayDate.disable();
    } else {
      this.holidayDate.enable();
    }

    this.affectionDatePicker.value = moment(holiday.affectedDate, this.dateFormat).toDate();
    this.holidayDatePicker.value = moment(holiday.date.iso, this.dateFormat).toDate();

    this.onRebuildForm();
    this.editorDialog.open();
  }

  /**
   * DeleteHoliday
   */
  public DeleteHoliday(holiday: Holiday) {
    this.selectedHoliday = holiday;
    let del = this.translate("rccc.settings.holidays.confirm_delete");
    // this.messageText = `¿Deseas borrar ${holiday.name}?`;
    this.messageText = `${del} ${holiday.name}?`;

    this.deleteHoliday.open();
  }

  /**
   * OnViewHolidayDetail
   */
  public OnViewHolidayDetail(holiday: Holiday): void {
    this.selectedHoliday = holiday;
    this.detailDialog.open();
  }

  /**
   * OnDeleteDialogCancel
   */
  public OnDeleteDialogCancel() {
    this.deleteHoliday.close();
    this.messageText = '';
    this.selectedHoliday = undefined;
  }

  /**
 * OnDeleteDialogConfirm
 */
  public OnDeleteDialogConfirm() {
    this.api.await();
    this.api.DeleteHoliday(this.selectedHoliday.holidayId).subscribe(x => {
      this.loadDisplayData(x);
      this.api.stopWaiting();
      this.showBarMessage(`${this.selectedHoliday.name} ${this.translate('rccc.settings.holidays.deleteConfirmMessage')}`, 'success');
      this.OnDeleteDialogCancel();
    }, (error: any) => {
      this.api.stopWaiting();
      this.OnDeleteDialogCancel();
      // this.showBarMessage(this.translate('rccc.settings.holidays.error.Generic'), 'error');
      this.showBarMessage(this.translate('rccc.settings.holidays.error.deleteErrorMessage'), 'error');
    });
  }

  /**
   * OnUpsertDialogCancel
   */
  public OnUpsertDialogCancel() {
    this.editorDialog.close();
    this.selectedHoliday = undefined;
  }

  /**
   * OnUpsertDialogConfirm
   */
  public OnUpsertDialogConfirm() {
    let holiday: Holiday = this.PrepareHolidayEntity();
    let affectedDateExists = this.ExistsDatesInCollection('affectedDate', this.affectedDate, holiday.affectedDate);
    let holidayDateExists = this.selectedHoliday.holidayId !== 0 ? false : this.ExistsDatesInCollection('holidayDate', this.holidayDate, holiday.holidayDate);
    if (affectedDateExists || holidayDateExists) {
      return;
    }
    this.api.await();
    if (this.selectedHoliday.holidayId === 0) {
      this.api.InsertHoliday(holiday).subscribe(x => {
        this.loadDisplayData(x);
        this.api.stopWaiting();
        this.OnUpsertDialogCancel();
        this.showBarMessage(`${holiday.name} ${this.translate('rccc.settings.holidays.addedConfirmMessage')}`, 'success');
      }, error => {
        this.api.stopWaiting();
        this.OnUpsertDialogCancel();
        this.showBarMessage(this.translate('rccc.settings.holidays.error.Generic'), 'error');
      })
    } else {
      delete holiday.holidayDate;
      delete holiday.country;

      this.api.UpdateHolidays(holiday).subscribe(x => {
        this.loadDisplayData(x);
        this.api.stopWaiting();
        this.OnUpsertDialogCancel();
        this.showBarMessage(`${holiday.name}  ${this.translate('rccc.settings.holidays.editedConfirmMessage')}`, 'success');
      }, error => {
        this.api.stopWaiting();
        this.OnUpsertDialogCancel();
        this.showBarMessage(this.translate('rccc.settings.holidays.error.edit_error_message'), 'error');
      });
    }
  }

  /**
   * Set Country.
   * @param country
   */
  public getCountries(country: Country) {
    this.selectedCountry = country;
    this.selectedCountryDescription = `${country.entryDesc}`;

    this.loadDisplayData(true);
  }

  /**
   * pickDate
   */
  public pickDate(month: ComboMonth) {
    this.selectedMonth = month;
    this.formattedDate = `${month.monthName} ${month.year}`;

    if (this.selectedCountry === undefined) {
      return;
    }
    this.loadDisplayData(true);
  }

  /**
   * pickAffectedDate
   */
  public pickAffectedDate(event: any) {
    let date = event.value;
  }

  /**
   * pickHolidayDate
   */
  public pickHolidayDate(event: any) {
    let date = event.value;
  }

  private loadDisplayData(response: boolean): void {
    if (response && (this.selectedCountry) && (this.dateFormat)) {
      this.api.await();
      this.api.GetHolidays(this.selectedCountry, this.selectedMonth, this.dateFormat).subscribe(x => {
        this.holidays = x;
        this.hasHolidays = x.length > 0;
        this.displayTabs = true;
        this.api.stopWaiting();
      }, (error: any) => {
        this.hasHolidays = false;
        this.api.stopWaiting();
      })
    }
  }

  private GetMonthName(monthIndex: number) {
    let result: string = '';

    //FIX ME

    // Object.keys(this.datepickerSetup.monthLabels).map(((key, index) => {
    //   if (index === monthIndex) {
    //     result = this.datepickerSetup.monthLabels[key];
    //   }
    // }));

    return result;
  }

  private GetMonths(year: number): ComboMonth[] {
    let indexes = Array.from(Array(12), (val, index) => index);
    let result: ComboMonth[] = indexes.map(value => {
      return <ComboMonth>{
        //Get month name from translate JSON
        monthName: this.monthDays[value],//this.GetMonthName(value),
        month: value,
        year: year
      }
    });

    return result;
  }

  private FormatDetailDate(stringyfiedDate: string): string {
    if (stringyfiedDate === undefined) {
      return '';
    }
    var date = moment(stringyfiedDate, this.dateFormat);

    return date.format('MMMM D');
  }

  /**
   * onCreateForm
   */
  private onCreateForm() {
    this.holidayDate = this.formbuilder.control(undefined, Validators.required);
    this.affectedDate = this.formbuilder.control(undefined, Validators.required);
    this.name = this.formbuilder.control('', [Validators.required, Validators.maxLength(128)]);
    this.holidayDesc = this.formbuilder.control('', [Validators.required, Validators.maxLength(250)]);

    this.formGroup = this.formbuilder.group({
      name: this.name,
      holidayDesc: this.holidayDesc,
      affectedDate: this.affectedDate,
      holidayDate: this.holidayDate
    });
  }

  /**
   * onRebuildForm
   */
  public onRebuildForm() {
    this.onCreateForm();

    this.formGroup.reset({
      name: this.selectedHoliday.name,
      holidayDesc: this.selectedHoliday.holidayDesc,
      affectedDate: this.selectedHoliday.holidayId === 0 ? undefined : moment(this.selectedHoliday.affectedDate, this.dateFormat).toDate(),
      holidayDate: this.selectedHoliday.holidayId == 0 ? undefined : moment(this.selectedHoliday.holidayDate, this.dateFormat).toDate()
    });
  }

  /**
   * PickAffectedDate
   */
  public PickAffectedDate(event: any) {
    if (this.affectedDate.hasError('repeated')) {
      this.affectedDate.setErrors({ 'repeated': false });
    }
  }

  /**
  * PickHolidayDate
  */
  public PickHolidayDate(event: any) {
    if (this.affectedDate.hasError('repeated')) {
      this.affectedDate.setErrors({ 'repeated': false });
    }
  }

  /**
   * GetDefaultPickerDate
   */
  private GetDefaultPickerDate() {
    if (this.selectedMonth === undefined) {
      return undefined;
    }

    return new Date(this.selectedMonth.year, this.selectedMonth.month + 1, 1);
  }

  /**
   * PrepareHolidayEntity
   */
  public PrepareHolidayEntity(): Holiday {
    const formModel = this.formGroup.value;

    let holiday: Holiday = <Holiday>{
      holidayId: this.selectedHoliday.holidayId,
      name: formModel.name,
      holidayDesc: formModel.holidayDesc,
      affectedDate: moment((formModel.affectedDate as Date)).format('YYYY-MM-DD'),
      holidayDate: moment((formModel.holidayDate as Date)).format('YYYY-MM-DD'),
      country: {
        countryCode: this.selectedCountry.entryCode,
        countryDesc: this.selectedCountry.entryDesc
      }
    };

    return holiday;
  }

  public ExistsDatesInCollection(keyToValidate: string, formControl: FormControl, value: string): boolean {
    let result: boolean = false;
    if (this.holidays !== undefined) {
      this.holidays.forEach(element => {
        if (this.selectedHoliday !== element) {
          if (element[keyToValidate] !== undefined) {
            var elementDate = moment(element[keyToValidate], this.dateFormat);
            var valueDate = moment(value);

            if (elementDate.isSame(valueDate)) {
              result = true;
              formControl.setErrors({ 'repeated': true })
            }
          }
        }
      });
    }
    return result;
  }

  private GetErrorMessage(formControl: FormControl, defaultValue: string): string {
    if (formControl.invalid) {
      if (formControl.getError('repeated')) {
        return this.translate('rccc.settings.holidays.error.repeatedDate');
      }

      if (formControl.getError('maxlength')) {
        let error = formControl.getError('maxlength');
        let first = this.translate('rccc.settings.holidays.error.maxLength');
        let second = this.translate('rccc.catalogs.fleet_type.characters');
        return `${first} ${error.requiredLength} ${second}`;
      }

      return this.translate(defaultValue);
    }
    return '';
  }

  setMoment(value:string){
    moment.locale(value);
  }

} // end class FleetTypeComponent