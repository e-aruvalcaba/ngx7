import { Component, OnInit, ElementRef, ViewChild, Injector } from '@angular/core';

import { PlantCapacityComponent } from '../../plant-capacity/plant-capacity.component';

import { ORDER_FULFILLMENT_APP_MENUES } from '../../../data/order-fulfillment-app-menues';
import { RCCC_APP_MENUES } from '../../../data/rccc-app-menues';
import { IAppMenu } from '../../../models/app-menu.interface';

import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
// import { DATEPICKER_ENGLISH_SETUP } from '../../../data/datepicker-english-setup'; //need to fix
// import { DATEPICKER_SPANISH_SETUP } from '../../../data/datepicker-spanish-setup'; //need to fix
// import { IDatepickerSetup } from '@cemex/cmx-datepicker-v4';  //need to fix not supported for v7
import { Country } from '../../../models/Country';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DatepickerInputComponent } from '@cemex/cmx-form-field-v4';
import { UnlockTime } from '../../../models/unlock-time';
import { ProductType } from '../../../models/product-type';

/**
 * FrequencyComponent
 */
@Component({
  selector: 'frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss']
})
export class FrequencyComponent extends PlantCapacityComponent {
  private countries: Country[];
  private materialTypes: ProductType[];
  private unlockTimes: UnlockTime[];
  private selectedUnlockTimes: UnlockTime;
  private selectedCountry: Country = null;
  private selectedMaterialType: ProductType = null;

  private hasItems: boolean = false;

  // Message dialog message
  private messageText: string;

  private selectedCountryPlaceholder: string;
  private selectedMaterialTypePlaceholder: string;

  @ViewChild('deleteFrequency') private deleteFrequency : CmxDialogComponent;

  ngOnInit(): void {

    this.session.menuApplicationItems.subscribe(
      result => {
        this.selectedCountryPlaceholder = this.translate('rccc.settings.holidays.country');
        this.selectedMaterialTypePlaceholder = this.translate('rccc.admin.selected_material_type_label');
      } // end anonymous result
    ); // end subscribe
    this.setup();
  } // end function on init

  constructor(
    injector: Injector
  ) {
    super(injector);
  } // end constructor

  public onSave(event: any): void {
    try {
      let unlockTime: UnlockTime = <UnlockTime>event[0];
      let haveDuplicates: boolean = false;
      haveDuplicates = this.validateDuplicates(unlockTime);
      if(!haveDuplicates) {
        this.api.await();
        this.api.InsertUnlockTime(unlockTime).subscribe(x => {
          let message = this.translate('rccc.catalogs.unlocktimes.messages.insert_successful');
          this.showBarMessage(message, 'success');
          this.api.stopWaiting();
          this.loadData();
        }, (error : any) => {
          this.api.stopWaiting();
          let message = this.translate('rccc.catalogs.messages.insert_unsuccessful');
          this.showBarMessage(message, 'error');
          this.api.stopWaiting();
          this.loadData();
        });
      } else {
        this.showBarMessage(this.translate('rccc.catalogs.unlocktimes.messages.error.duplicate'), 'error');
      } // end if then else have duplicates
    } catch (e) {
      this.showBarMessage(e, 'error');
      this.api.stopWaiting();
      this.loadData();
    } // end try catch
  } // end function on save

  public onEdit(event: any): void {
    let unlockTime: UnlockTime = <UnlockTime>event[0];
    unlockTime.countryCode = unlockTime.countryCode.trim();

    let haveDuplicates = this.validateDuplicates(unlockTime);

    this.api.await();
    this.api.UpdateUnlockTime(unlockTime).subscribe(x => {
      let message = this.translate('rccc.catalogs.unlocktimes.messages.edit_successful');
      this.showBarMessage(message, 'success');
      this.api.stopWaiting();
      this.loadData();
    }, (error : any) => {
      this.api.stopWaiting();
      // let message = this.translate('rccc.settings.holidays.error.Generic');
      let message = this.translate('rccc.catalogs.messages.edit_unsuccessful');
      this.showBarMessage(message, 'error');
    })
  }

  public onDelete(event: any): void {
    this.selectedUnlockTimes = <UnlockTime>event[0];
    let message = `${ this.translate('rccc.catalogs.unlocktimes.messages.delete_first')} ${this.selectedUnlockTimes.materialTypeDesc} & ${this.selectedUnlockTimes.countryDesc} ${ this.translate('rccc.catalogs.unlocktimes.messages.delete_last') }`;

    this.showMessage(message);
  }

  public onCancel(event: any): void {
    if(this.unlockTimes.length === 0 || this.unlockTimes === undefined) {
      this.hasItems = false;
    }
  }

  /**
   * loadCountries
   */
  private loadCountries() {
    this.api.getCountries().subscribe(countries => {
      countries.map(
        c => {
          c.entryDesc = c.entryCode.trim() + " - " + c.entryDesc.trim(); return c
        }
      ); // end map
      countries.splice(0,0,{
        entryId: -1,
        entryCode: "",
        entryDesc: ""
      }); // end splice
      this.countries = countries;
      this.api.stopWaiting();
    }, (error: any) => {
      console.error('loadCountries error');
      console.error(error);
      this.showBarMessage(this.translate('rccc.catalogs.unlocktimes.message.errors.loadCountries'), 'error');
      this.api.stopWaiting();
    });
  } // end function load countries

  /**
   * loadMaterialTypes
   */
  private loadMaterialTypes() {
    this.api.getProductTypes(0).subscribe(materialTypes => {
      materialTypes.splice(0,0,{
        productTypeId: -1,
        productTypeCode: "",
        productTypeDesc: ""
      }); // end splice
      this.materialTypes = materialTypes;
      this.api.stopWaiting();
    }, (error: any) => {
      console.error('loadMaterialTypes error');
      console.error(error);
      this.showBarMessage(this.translate('rccc.catalogs.message.errors.load_material_types'), 'error');
      // this.showBarMessage(this.translate('rccc.errors.generic_message'), 'error');
      this.api.stopWaiting();
    }); // end subscribe
  } // end function load material types

  /**
   * setup
   */
  public setup() {

    this.api.await();
    this.loadCountries();
    this.loadMaterialTypes();
    this.loadData();
  } // end function setup

  /**
   * selectCountry
   */
  private selectCountry(country: Country) {
    if (country.entryId > -1) {
      this.selectedCountry = country;
      this.selectedCountryPlaceholder = this.selectedCountry.entryDesc;
    } else {
      this.selectedCountry = null;
      this.selectedCountryPlaceholder = this.translate('rccc.settings.holidays.country');
    } // end if country entry id

    //  Here reloads the data
    this.loadData();
  } // end function selectCountry

  /**
   * selectMaterialType
   */
  private selectMaterialType(materialType: ProductType) {
    if (materialType.productTypeId > -1) {
      this.selectedMaterialType = materialType;
      this.selectedMaterialTypePlaceholder = `${this.selectedMaterialType.productTypeCode} - ${this.selectedMaterialType.productTypeDesc}`;
    } else {
      this.selectedMaterialType = null;
      this.selectedMaterialTypePlaceholder = this.translate('rccc.admin.selected_material_type_label');
    } // end if material type id > -1

    //  Here reloads the data
    this.loadData();
  } // end function select material type

  /**
   * loadData
   */
  private loadData() {
    this.api.await();
    this.api.getUnlockTimes(
      this.selectedCountry,
      this.selectedMaterialType).subscribe(x => {
        this.unlockTimes = x;
        this.api.stopWaiting();
        this.hasItems = x.length > 0;

        if(!this.hasItems) {
          this.unlockTimes = [];
        }
      }, (error: any) => {
        this.hasItems = false;
        this.unlockTimes = [];
        this.showBarMessage(this.translate('rccc.catalogs.message.errors.load_data'), 'error');
      }
    );
  } // load data

  /**
   * Shows a confim dialog
   *
   * @param message The message to show
   */
  showMessage(message: string) {
    this.messageText = message;
    this.deleteFrequency.open();
    window.scrollTo(0,0);
  } // end function showMessage

  onDeleteDialogCancel(): void {
    this.selectedUnlockTimes = null;
    this.deleteFrequency.close();
  }

  onDeleteDialogConfirm(): void {
    this.api.await();
    this.api.DeleteUnlockTime(this.selectedUnlockTimes.unlockTimeId)
    .subscribe(x => {
      this.api.stopWaiting();
      const message = this.translate('rccc.catalogs.unlocktimes.messages.delete_successful');
      this.showBarMessage(message, 'success');
      this.loadData();
      this.onDeleteDialogCancel();
    }, error => {
      console.error(error);
      this.api.stopWaiting();
      let errorMessage = this.translate('rccc.catalogs.messages.delete_unsuccessful');
      if (error.hasOwnProperty('error')) {
        if (error.hasOwnProperty('moreInformation')) {
          let moreInformation: any = "";
          try {
            let moreInformation = JSON.parse(error.error.moreInformation);
            if (moreInformation.hasOwnProperty('code')) {
              if (moreInformation.code == 53002) {
                errorMessage = this.translate('rccc.errors.dependency_message');
              } // end if code is 53002
            } // end if has own property code
          } catch (ex) {
            errorMessage = ex;//this.translate('rccc.errors.generic_message');
          } // end if try
        } // end if has own property moreInformation
      } // end if has error
      this.showBarMessage(errorMessage, 'error');
      this.onDeleteDialogCancel();
    });
  }

  validateDuplicates(unlockTime: UnlockTime): boolean {

    if (unlockTime.unlockTime < 1) {
      throw new Error(`${this.translate('datatable.errors.min')} 1`);
    } // end if values

    if (unlockTime.unlockTime > 999) {
      throw new Error(`${this.translate('datatable.errors.min')} 999`);
    } // end if values

    for (let index = 0; index < this.unlockTimes.length; index++) {
      const element: UnlockTime = <UnlockTime>this.unlockTimes[index];

      if(element.materialTypeId === unlockTime.materialTypeId
        && element.countryCode === unlockTime.countryCode) {
          return true;
        }
    }
    return false;
  } // end function validate duplicates
} // end class FrequencyComponent