//  Core imports
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  Injector
} from '@angular/core';

import { PlantCapacityComponent } from '../plant-capacity/plant-capacity.component';

import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4

//  Models
import { Plant } from '../../models/plant';
import { ProductType } from '../../models/product-type';
import { MaterialType } from '../../models/material-type';
import { IMaterialType } from '../../models/material-type.interface';
import { Bucket } from '../../models/bucket';
import { BucketDetail } from '../../models/bucket-detail';
import { CapacityCheckItem } from '../../models/capacity-check-item';
import { CapacityDistributionItem } from '../../models/capacity-distribution-item';
import { ICommercialManagement } from '../../models/commercial-management.interface';
import * as moment from 'moment';

//  Data
import { HOURS } from '../../data/hours';
import { ICustomer } from '../../models/customer.interface';
import { IMaterial } from '../../models/material.interface';
import { AlertService } from '@cemex/cmx-alert-v7'; //updated from v2
import { ICountrySettings, ShippingCondition } from '../../models/country-settings.interface';
import { CmxDatepickerComponent } from '@cemex/cmx-datepicker-v4';


/**
 * OfferPlanner Component class
 */
@Component({
  selector: 'app-offer-enablement-admin',
  templateUrl: './offer-enablement-admin.component.html',
  styleUrls: ['./offer-enablement-admin.component.scss']
})
export class OfferEnablementAdminComponent extends PlantCapacityComponent  {

  //  Properties
  //    My plants
  myPlants: Plant[];
  //    My product types
  productTypes: ProductType[];
  //    Capacity items
  capacityCheckItems: CapacityDistributionItem[];
  //    Commercial management list
  commercialManagementItems: ICommercialManagement[];
  //    Customers List
  customersItems: ICustomer[];
  //    Materials List
  materials: IMaterial[];

  //    The properties for the filter
  //      The product
  productType: ProductType;

  //    The commercial management
  commercialManagement: ICommercialManagement;
  //    The Customer selected
  customer: ICustomer;
  //    The Material selected
  material: IMaterial;

  //      Placeholder
  private selectedCommercialManagementDescription: string;
  private selectedCustomerDescription: string;
  private selectedMaterialDescription: string;

  //  The import file input to import data
  @ViewChild('importFileInput')
  private importFileInput: any;

  //  ViewChilds Dialogs
  @ViewChildren(CmxDialogComponent) dialogs: QueryList<CmxDialogComponent>;
  @ViewChild("datepicker") datePicker: CmxDatepickerComponent;
  @ViewChild("datepickerClonInitial") datepickerClonInitial: CmxDatepickerComponent;
  @ViewChild("datepickerClonFinal") datepickerClonFinal: CmxDatepickerComponent;
  private cloneDialog: CmxDialogComponent;
  private confirmDialog: CmxDialogComponent;
  private messageDialog: CmxDialogComponent;

  //      Confirm dialog message
  private confirmMessage: string;

  private confirmMessageSubtitle: string;

  //      Message dialog message
  private messageText: string;

  //  This properties are used to placeholder the dropdowns
  private selectedProductTypeDescription: string;

  //  This properties are used to enable or disable the buttons
  private canSave = false;
  private canDelete = false;
  private canCopyModel = false;
  private canImport = false;
  private canRefresh = false;
  private pristine = true;
  private isDataPresent = false;
  private isEditable = false;
  private isItemsValid = false;
  private isNewDataset = true;
  private hasItems: boolean = false;
  private isDelete: boolean = false;
  private isErrorDialog: boolean = false;
  private isFiltersToggled: boolean = false;
  public disabledDates: Date[] = [];
  public disabledWeekDays = [];

  // Country Settings
  private countrySettings = new ICountrySettings();

  //  This property holds the current rol: admin or planner
  private rol = "admin";

  //  This variable stores the HOURS values
  hours = HOURS;

  //  Indicates the columns to disable
  private disableColumn: string[];

  private haveCommercialManagement:boolean = false;

  //  Download template link
  private downloadTemplateLink: string;

  /**
   * Creates an instance of OfferPlannerComponent
   *
   * @param injector The injector helper to inject all parent dependencies
   */
  constructor(
    injector: Injector,
    private alertService: AlertService
  ) {
    super(injector);
  } // end constructor

  /**
   * Initiates the component
   */
  ngOnInit() {
    this.onInit();
    this.titleLanguageKey = 'rccc.admin.title';
    this.getMyPlants();
    this.getCommercialManagementItems();
    this.getCustomers();
    this.GetMaterials();

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.getCountrySettings();
    }

    this.disableColumn = ['false', 'false', 'false', 'false'];

    if (sessionStorage.getItem('country') != 'MX') {
      this.disableColumn = ['false', 'false', 'true', 'false'];
    } // end if in Colombia

    this.route.data.subscribe(
      data => {
        this.rol = data.rol;
        this.titleLanguageKey = `rccc.${this.rol}.title`;
        if (this.rol == 'admin') {
          this.downloadTemplateLink = 'vendor/templates/OverallCapacityTemplate.xlsx';
        } else {
          this.downloadTemplateLink = 'vendor/templates/DistributedCapacityTemplate.xlsx';
        }
      }
    ); // end subscribe

    this.session.menuApplicationItems.subscribe(
      result => {

        this.selectedPlantDescription = this.translate('rccc.admin.selected_plant_label');
        this.selectedProductTypeDescription = this.translate('rccc.admin.selected_material_type_label');
        this.selectedCommercialManagementDescription = this.translate('rccc.admin.selected_commercial_management_label');
        this.selectedCustomerDescription = this.translate('rccc.admin.selected_customer_label');
        this.selectedMaterialDescription = this.translate('rccc.admin.selected_material_label');

        if ( (result.length) && (this.plant) && (this.productTypes) ) {
          this.getProductTypes(this.plant);
        } // end if result & plant & productType
      }
    );
    this.enableActions();
  } // end on init

  /**
   * Initiates the view children
   */
  ngAfterViewInit() {

    let dialogsArray = [
      this.cloneDialog,
      this.confirmDialog,
      this.messageDialog
    ]; // end dialogsArray

    this.dialogs.forEach(
      (dialog, index) => {
        switch (index) {
          case 0:
            this.cloneDialog = dialog;
          break;
          case 1:
            this.confirmDialog = dialog;
          break;
          case 2:
            this.messageDialog = dialog;
          break;
        } // end switch
      } // end anonymous function
    ); // end foreach
  } // end function after view init

  /**
   * Event trigger on date selection
   *
   * @param e The arguments of the event
   */
  onPickDate() {
    this.getCapacityCheckItems();
    this.showDatePicker = false;
  } // end function pickDate

  /**
   * Refreshed the query
   */
  refresh() {
    if (this.productType) {
      this.getCapacityCheckItems();
    } // end if this productType
  } // end function refresh

  /*
  *** Updates the events on datePicker to get non working days on component init
  */
  updateDatePicker(){
    this.updatePicker(this.datePicker, this.disabledDates);
  }// end function updateDatePicker

  updatePickerCloneInitial(){
    this.updatePickerClone(this.datepickerClonInitial ,this.disabledDates);
  }// end function updatePickerCloneInitial

  updatePickerCloneFinall(){
    this.updatePickerCloneFinal(this.datepickerClonFinal ,this.disabledDates);
  }// end function updatePickerCloneFinall

  private round(n: any): number {
    return Number(Number(n).toFixed(3));
  } // end function round

  /**
   * Validates distribution before sending
   */
  private validateDistribution(): void {
    for (let item of this.capacityCheckItems) {
      let loads: number = this.round(item.loadsOffered - item.loadsCommitted);
      let tons: number = this.round(item.tonsOffered - item.tonsCommitted);
      let dLoads: number = 0;
      let dTons: number = 0;
      for (let dItem of item.items) {
        dLoads += this.round(dItem.loadsOffered - dItem.loadsCommitted);
        dTons += this.round(dItem.tonsOffered - dItem.tonsCommitted);
      } // end fo each distribution items

      if (this.round(loads) < this.round(dLoads) || this.round(tons) < this.round(dTons)) {
        console.error('distributed offer bigger than overall');
        console.error({loads, dLoads, tons, dTons});
        throw new Error(this.translate('digital_confirmation.erros.distributed_offer_bigger_overall') + ' ' + item.ampm);
      } // end check is distribution lesses than total
    } // end for each item
  } // end function validates distribution

  /**
   * Handles succesful save capacities
   *
   * @param response any
   *
   * @return void
   */
  private handleSaveCapacities(response: any): void {
    this.getCapacityCheckItems();
    this.enableActions();
    this.api.stopWaiting();
    this.alertService.openSuccess(this.translate("rccc.alert.model_updated.message"), '', 5000);
  } // end function handleSaveCapacities


  /**
   * Handles unsuccesful save capacities
   *
   * @param err any
   *
   * @return void
   */
  private handleError(err: any): void {
    this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
    console.error(err);
    this.api.stopWaiting();
  } // end function handleError

  /**
   * Saves the current model
   */
  save() {
    try {

      //  Set awaiting
      this.api.await();
      this.setupProperties();
      this.validateDistribution();

      //  Assigns the commercial management to the customer, if any
      ((this.customer) && ((!this.customer.customerId) || this.customer.customerId == -1)) && (this.customer = null);
      ((this.customer) && (this.commercialManagement)) && (this.customer.commercialManagement = this.commercialManagement);
      ((!this.customer) && (this.commercialManagement)) && (this.customer = {commercialManagement: this.commercialManagement});

      //  Validate version and normalization
      let versionNumber: number = this.versionToggle.getVersion();
      if (versionNumber == 2 && this.versionToggle.isNormalized() && this.rol == "admin") {
        this.api.updateOverallCapacity(
          this.plant.plantId,
          this.material,
          this.customer,
          this.date,
          this.capacityCheckItems
        ).subscribe(
          response => { this.handleSaveCapacities(response);}, // end on response
          error => { this.handleError(error); }
        ); // end subscribe
        return;
      } // end if versionToogle

      if (versionNumber == 2 && this.versionToggle.isNormalized() && this.rol == "planner") {
        this.api.updateDistributedCapacity(
          this.plant.plantId,
          this.material,
          this.customer,
          this.date,
          this.capacityCheckItems
        ).subscribe(
          response => { this.handleSaveCapacities(response);}, // end on response
          error => { this.handleError(error); }
        ); // end subscribe
        return;
      } // end if versionToogle

      this.api.updateCapacityCheckItems(
        this.plant.plantId,
        this.material,
        this.customer,
        this.date,
        this.capacityCheckItems
      ).subscribe(
        response => { this.handleSaveCapacities(response);}, // end on response
        error => { this.handleError(error); }
      ); // end subscribe
    } catch (ex) {
      this.handleError(ex);
    } // end try catch
  } // end function save

  /**
   * Deletes a set of delete capacity check items
   */
  delete() {
    //  Set awaiting
    this.confirmDialog.close();
    this.api.await();

    //  Construct the material and customer
    this.setupProperties();

    //  Call the delete api
    this.api.deleteCapacityCheckItems(
      this.plant.plantId,
      this.material,
      this.customer,
      this.date
    ).subscribe(
      response => {
        this.getCapacityCheckItems();
        this.enableActions();
        this.api.stopWaiting();
        this.alertService.openSuccess(this.translate("rccc.alert.model_deleted.message"), '', 5000);
      }, // end on response
      error => {
        this.alertService.openError(this.translate('rccc.alert.errors.model_deleted.message_error'),
        this.translate('rccc.errors.try_again_later'), 5000);
      }
    ); // end subscribe
  } // end function delete

  /**
   * Opens the dialog to copy a model
   */
  openCopyDialog() {
    this.cloneDialog.open();
  } // end function openCopyDialog

  /**
   * Shows a message dialog
   *
   * @param message The message to show
   */
  closeMessageDialog() {
    this.messageDialog.close();
  } // end function closeMessageDialog

  /**
   * Shows a confim dialog
   *
   * @param message The message to show
   */
  showConfirm(message: string) {
    this.confirmMessage = message;
    this.confirmDialog.open();
  } // end function showConfirm

  /**
   * Opens the dialog to confirm deletion
   */
  confirmDelete() {
    this.isDelete = true;
    this.confirmMessageSubtitle = this.translate("rccc.landing_page.modules.overall_business_unit_delete_submessage");
    this.showConfirm(this.translate("rccc.landing_page.modules.overall_business_unit_delete_message"));
  } // end function confirmDelete

  /**
   * Closes the dialog for confirmation
   */
  closeConfirmDialog() {
    this.isDelete = false;
    this.confirmMessageSubtitle = "";
    this.confirmDialog.close();
  } // end function closeConfirmDialog

  private setupProperties(): void {
    //  Assigns the commercial management to the customer, if any
    ((this.customer) && (this.commercialManagement)) && (this.customer.commercialManagement = this.commercialManagement);
    ((!this.customer) && (this.commercialManagement)) && (this.customer = {commercialManagement: this.commercialManagement});

    //  Assigns the material type
    (this.material) && (this.material.materialType = { materialTypeId: this.productType.productTypeId });
    (!this.material) && (this.material = { materialType:{ materialTypeId: this.productType.productTypeId }});
  } // end function setup properties

  /**
   * Triggers the api clone capacity check items function
   */
  copyModel() {

    this.cloneModelErrorText = "";

    let cleanIsCloningOrImportingOnError = 0;

    try {
      let isCloningOrImporting: number = 0;
      isCloningOrImporting = Number(localStorage.getItem('isCloningOrImporting'));

      if (isCloningOrImporting == 1) {
        throw new Error(this.translate('digital_confirmation.errors.offer_enablement.is_cloning_or_importing'));
      } // end if isClonigOrImporting

      isCloningOrImporting = cleanIsCloningOrImportingOnError = 1;
      localStorage.setItem('isCloningOrImporting', String(isCloningOrImporting));

      //  Run validations
      this.validateCopyModel();
      this.cloneDialog.close();

      //  Set awaiting
      this.api.await();
      this.setupProperties();

      //  Call the delete api
      this.api.cloneCapacityCheckItems(
        this.plant.plantId,
        this.material,
        this.customer,
        this.date,
        this.fromDate,
        this.toDate,
      ).subscribe(
        response => {
          this.getCapacityCheckItems();
          this.enableActions();
          this.api.stopWaiting();
          this.alertService.openSuccess(this.translate("rccc.alert.model_cloned.message"), '', 5000);
          //  Set local cloning or importing to false
          localStorage.setItem('isCloningOrImporting', '0');
        }, // end on response
        error => {
          //  Set isCloningOrImporting to false
          localStorage.setItem('isCloningOrImporting', '0');
          this.alertService.openError(error, "", 5000);
        }
      ); // end subscribe
    } catch (ex) {
      if (cleanIsCloningOrImportingOnError == 1) {
        localStorage.setItem('isCloningOrImporting', '0');
      } // end if cleanIsCloningOrImportingOnError
      this.alertService.openError(ex, "", 5000);
      this.cloneModelErrorText = ex;
    } // end try
  } // end function copyModel

  /**
   * Submits the form
   */
  onImportFile(e: any) {
    let cleanIsCloningOrImportingOnError = 0;

    try {
      let isCloningOrImporting: number = 0;
      isCloningOrImporting = Number(localStorage.getItem('isCloningOrImporting'));

      if (isCloningOrImporting == 1) {
        throw new Error(this.translate('digital_confirmation.errors.offer_enablement.is_cloning_or_importing'));
      } // end if isClonigOrImporting

      isCloningOrImporting = cleanIsCloningOrImportingOnError = 1;
      localStorage.setItem('isCloningOrImporting', String(isCloningOrImporting));

      //  Here we validate it's and excel file
      //  If OK, then we submit the form:
      let fileName = e.target.value;
      if (!(fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
        throw new Error(this.translate('rccc.import_file.error.file_type'));
      } // end file name ends with xls or xlsx

      // Create the form
      const formData = new FormData(e.target.form);

      //  Set awaiting
      this.api.await();

      //  Call the api to import the file:
      this.api.importModel(formData, this.rol).subscribe(
        response => {
          this.importFileInput.nativeElement.value = "";
          this.getCapacityCheckItems();
          this.getCommercialManagementItems();
          this.enableActions();
          this.api.stopWaiting();
          this.alertService.openSuccess(this.translate("rccc.alert.model_imported.message"), '', 5000);
          //  Set isCloningOrImporting to false
          localStorage.setItem('isCloningOrImporting', '0');
        }, // end on response
        error => {
          //  Set isCloningOrImporting to false
          localStorage.setItem('isCloningOrImporting', '0');
          this.importFileInput.nativeElement.value = "";
          this.alertService.openError(error, this.translate('rccc.errors.try_again_later'), 5000);
          // this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
        }
      ); // end subscribe
    } catch (ex) {
      if (cleanIsCloningOrImportingOnError == 1) {
        localStorage.setItem('isCloningOrImporting', '0');
      } // end if cleanIsCloningOrImportingOnError
      this.alertService.openError(ex, this.translate('rccc.errors.try_again_later'), 5000);
      // this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
    } // end try catch
  } // end function onImportFile

  /**
   * Gets myPlants from the api
   */
  getMyPlants(): void {
    //  Set awaiting
    this.api.await();
    this.api.getMyPlants().subscribe(
      response => { this.myPlants = response; this.api.stopWaiting(); },
      error => { console.error(error); this.api.stopWaiting(); }
    ); // end subscribe
  } // end getMyPlants

  getCountrySettings() {
    this.api.getCountrySettings(sessionStorage.getItem('country')).subscribe(
      result => {
        try {

          this.countrySettings = result;

          if (!this.countrySettings) {
            throw new Error(this.translate('digital_confirmation.errors.no_country_settings'));
          } // end if no country settings

          this.countrySettings.calendar.nonWorkingDays.forEach(nwd => {
            let numbers = nwd.split('-');
            this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1])-1, Number(numbers[2])));
          });

          for (let index = 0; index < 7; index++) {
            if (this.checkIfDateIsDisabled(this.countrySettings.calendar.workingDays, index)) {
              this.disabledWeekDays.push(index);
            }
          }

          this.fixDistributedCapacityTable(this.countrySettings.shippingConditions);
        } catch (err) {
          this.alertService.openError(err, '', 5000);
          this.api.stopWaiting();
        } // end try catch
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

        value /=2;
      }

      return binary[6-position] != 1;
  }

  fixDistributedCapacityTable(shippingConditions: ShippingCondition[]) {
    var column1 = 'false';
    var column4 = 'false';
    var column3 = 'false';
    var column2 = 'false';

    if (!shippingConditions.find(x => x.shippingConditionCode == "01")) {
      column1 = 'true';
    }

    if (!shippingConditions.find(x => x.shippingConditionCode == "02")) {
      column4 = 'true';
    }

    if (!shippingConditions.find(x => x.shippingConditionCode == "05")) {
      column3 = 'true';
    }

    if (!shippingConditions.find(x => x.shippingConditionCode == "21")) {
      column2 = 'true';
    }

    this.disableColumn = [column1, column2, column3, column4];
  }

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
        this.alertService.openError(this.translate('rccc.catalogs.error.getCommercialManagementItems'),
        this.translate('rccc.errors.try_again_later'), 5000);
      } // end on error
    ); // end api get commercial management list subscribe
  } // end function get commercial management list
  /**
   * Get the product type from my plants
   *
   * @param plant The plant to search
   */
  getProductTypes(plant) {
    //  Set awaiting
    this.api.await();
    this.plant = plant;
    this.selectedPlantDescription = `${this.plant.plantCode} - ${this.plant.plantDesc}`;

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.api.getBusinessUnitSettings(sessionStorage.getItem('country'), this.plant.plantCode).subscribe(
        response => {
          try {
            if (response) {
              this.productTypes = response.productTypes;
              this.productTypes.map(pt => pt.productTypeDesc = this.translate(pt.productTypeDesc));
              this.fixDistributedCapacityTable(response.shippingConditions);
              this.disabledDates = [];
              this.disabledWeekDays = [];
              this.haveCommercialManagement = response.commercialManagement;

              response.calendar.nonWorkingDays.forEach(nwd => {
                let numbers = nwd.split('-');
                this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1])-1, Number(numbers[2])));
              });

              for (let index = 0; index < 7; index++) {
                if (this.checkIfDateIsDisabled(response.calendar.workingDays, index)) {
                  this.disabledWeekDays.push(index);
                }
              }
            } else {
              if (!this.countrySettings) {
                throw new Error(this.translate('digital_confirmation.errors.no_country_settings'));
              } // end if no country settings
              this.productTypes = this.countrySettings.productTypes;
              this.productTypes.map(pt => pt.productTypeDesc = this.translate(pt.productTypeDesc));
              this.fixDistributedCapacityTable(this.countrySettings.shippingConditions);
            }

            if (this.productType) {
              //  Get the product type, translated
              let productType =
                this.productTypes.filter(
                  productType => productType.productTypeId == this.productType.productTypeId
                )[0];

              if (productType) {
                //  Query the capacities
                this.getCapacityCheckItems();
              } else {
                this.capacityCheckItems = [];
                this.api.stopWaiting();
              } // end if productType
            } else {
              this.api.stopWaiting();
            }// end if this.productType
          } catch (err) {
            this.alertService.openError(err, '', 5000);
            this.api.stopWaiting();
          } // end try catch
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
              this.getCapacityCheckItems();
            } else {
              this.capacityCheckItems = [];
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
   * getCustomers
   */
  getCustomers() {
    this.api.GetCustomers().subscribe(x => {
      this.customersItems = x;
    });
  }

  /**
   * GetMaterials
   */
  GetMaterials() {
    this.api.GetMaterials().subscribe(x => {
      this.materials = x;
    });
  }

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
        // throw new Error("No commecial management found");
      } // end if not commercial management

      this.commercialManagement = (commercialManagement.commercialManagementCode == "") ? null : commercialManagement;
      this.selectedCommercialManagementDescription = commercialManagement.commercialManagementCode;

      this.getCapacityCheckItems();
    } catch (err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
      console.error(err);
      // this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
    } // end try catch
  } // end function get capacity by commercial management

  /**
   * setCustomer
   */
  public setCustomer(customer: ICustomer): void {
    try {

      if(!customer) {
        throw new Error(this.translate("digital_confirmation.daily_plant_capacity.errors.customer"));
        // throw new Error("No customer found");
      }

      this.customer = (customer.customerCode == "") ? null : customer;
      this.selectedCustomerDescription = customer.customerDesc;
      this.getCapacityCheckItems();

    } catch(err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
    }
  }

  /**
   * setMaterial
   */
  public setMaterial(material: IMaterial): void {
    try {
      if(!material) {
        throw new Error(this.translate("digital_confirmation.daily_plant_capacity.errors.material"));
        // throw new Error("No material found");
      }

      this.material = material;
      this.selectedMaterialDescription = material.materialDesc;
      this.getCapacityCheckItems();

    } catch(err) {
      this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
    }
  }

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
      this.getCapacityCheckItems();
    } catch (err) {
      this.alertService.openError(err, this.translate('rccc.errors.try_again_later'), 5000);
    } // end try catch
  } // end function getCapacityItems

  /**
   * Get the capacity items from plant, product type and date, optionally by commercial management
   *
   */
  private getCapacityCheckItems() {

    if (this.datePickerError) {
      this.showBarMessage(this.translate('rccc.errors.sunday_error'), "error");
      return;
    } // end if date picker error

    if ((!this.plant) || (!this.productType) || (!this.date)) {
      console.warn("Plant or product type or date not set");
      return;
    } // end if product type

    this.canSave = false;
    this.canImport = true;

    let commercialManagementCode = (this.commercialManagement) ? this.commercialManagement.commercialManagementCode : null;
    let customerCode = (this.customer) ? this.customer.customerId : null;
    let material = (this.material) ? this.material.materialId : null;

    //  Set awaiting
    this.api.await();
    this.api.getCapacityItems(
      this.plant.plantId,
      this.productType.productTypeId,
      this.date,
      this.rol,
      commercialManagementCode,
      customerCode,
      material
    ).subscribe(
      response => {
        this.hasItems = response.length > 0;
        this.pristine = true;
        this.capacityCheckItems = response;

        this.isNewDataset = true;
        for (let item of this.capacityCheckItems) {
          this.isNewDataset = (this.isNewDataset && (item.bucketId == 0));
        } // end for item

        this.canDelete = this.capacityCheckItems[0].canDelete;
        this.api.stopWaiting();
        this.isDataPresent = true;
        this.enableActions();
      },
      error => {
        this.capacityCheckItems = [];
        this.enableActions();
        if (typeof(error) == "string" &&
              (error.includes('There is not Overall offer') || error.includes('No existe oferta para distribuir'))) {
          this.alertService.openError(
            this.translate('rccc.service.no_capacity_items_found_message'),
            '',
            5000
          );
        } else {
          this.alertService.openError(this.translate('rccc.errors.generic_message'), this.translate('rccc.errors.try_again_later'), 5000);
        }// end if there's no overall offer
      }
    ); // end subscribe
  } // end function getCapacityItems

  /**
   * Validates the inputs: Plant, material and dates
   */
  private validateCopyModel() {
    let valid = this.plant && this.plant.plantId && this.productType && this.productType.productTypeId &&
      this.date && this.fromDate && this.toDate;
    if (!valid) {
      console.warn(
        [this.plant.plantId,
        this.productType.productTypeId,
        this.date,
        this.fromDate,
        this.toDate]
      ); // end console.warn
      throw new Error(this.translate("rccc.clone_dialog.message.not_valid"));
    } // end if not valid
  } // end function validateCopyModel

  private disableCopyModelInModal():boolean {
    if (this.cloneModelValidation) {
      return true;
    }
    return (this.date >= this.fromDate) || (this.fromDate > this.toDate);
  }

  /**
   * Fires when check items changed
   *
   * @param {boolean} changed True if changed, false otherwise
   */
  private onItemsChanged(changed: boolean) {
    this.pristine = !changed;
    this.enableActions();
  } // end private function onItemsChanged

  /**
   * Fires when capacity items table emits if is editable
   *
   * @param {boolean} isEditable  True if table is editable, false otherwise
   *
   * @return {undefined}
   */
  private onEditable(isEditable: boolean) {
    this.isEditable = isEditable;
    this.enableActions();
  } // end function onEditable

  /**
   * Catches items validations and updates actions
   */
  private onTableValidate(isValid: boolean) {
    this.isItemsValid = isValid;
    this.enableActions();
  } // end function on table validate

  /**
   * Recalculates wich actions must be enabled
   */
  private enableActions() {
    //  Set all false
    this.canSave = false;
    this.canImport = false;
    this.canCopyModel = false;
    this.canDelete = false;
    this.canRefresh = false;
    //  Do the logical calculations
    this.canSave = !this.pristine && this.isItemsValid;
    this.canImport = !this.canSave;
    this.canRefresh = this.isDataPresent && (typeof this.productType != "undefined") && !this.canSave;
    this.canDelete = this.canCopyModel = this.pristine && this.isDataPresent && !this.isNewDataset;
  } // end function enableActions

  /**
   * Closes the clone dialog
   */
  private closeCloneDialog() {
    this.cloneDialog.close();
  } // end closeCloneDialog function

  /**
   * Opens import file input
   */
  private openImportFile(importFileInput: HTMLElement) {
    importFileInput.click();
  } // end function openImportFile

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
} // end class OfferPlannerComponent