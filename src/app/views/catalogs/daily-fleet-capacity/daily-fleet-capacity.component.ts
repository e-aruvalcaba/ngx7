import {
  Component,
  Injector,
  ViewChildren,
  QueryList,
  ViewChild
} from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { PlantCapacityComponent } from '../../plant-capacity/plant-capacity.component';
import { FleetCapacityItem } from '../../../models/fleet-capacity-item';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
import { SecurityService } from '../../../services/security.service';

//  Models
import { Plant } from '../../../models/plant';
import { ICountrySettings } from '../../../models/country-settings.interface';
import { CmxDatepickerComponent } from '@cemex/cmx-datepicker-v4'; //v4 control
import { extend } from 'webdriver-js-extender';


@Component({
  selector: 'daily-fleet-capacity',
  templateUrl: './daily-fleet-capacity.component.html',
  styleUrls: ['./daily-fleet-capacity.component.scss']
})
export class DailyFleetCapacityComponent extends PlantCapacityComponent{

//  Properties
  //    My plants
  myPlants: Plant[];

  //    The properties for the filter
  //      The plant
  plant: Plant;

  //    Capacity items
  fleetCapacityItems: FleetCapacityItem[];

  //      The date
  date: Date;
  formattedDate: string;
  datePickerError: boolean = false;

  //      The date for cloning
  fromDate: Date;
  toDate: Date;

  //  ViewChilds Dialogs
  @ViewChildren(CmxDialogComponent) dialogs: QueryList<CmxDialogComponent>;
  @ViewChild('datepicker') datePicker:CmxDatepickerComponent;
  private confirmDialog: CmxDialogComponent;
  private cloneDialog: CmxDialogComponent;

  //      Confirm dialog message
  private confirmMessage: string;

  //  This properties are used to enable or disable the buttons
  private canSave = false;
  private canDelete = false;
  private canRefresh = false;
  private canCopyModel = false;
  private pristine = true;
  private isDataPresent = false;
  private isEditable = false;
  private isItemsValid = false;
  private isNewDataset = true;
  private areCommitsPresent = false;

  // The formGroup
  public formGroup: FormGroup;

  //  Indicated if the form has been created
  private formCreated: boolean = false;

  //  The maximum number of units
  private maxUnits: number = 999;

  //  Indicates an error
  private unitsInvalid: boolean = false;

  //  The tooltip error
  private unitsToolTip: string = "";

  private chartWidth: number = 25;
  private chartWidthRemanent: number = 75;

  private chartItems: any[];

  private isDelete: boolean = false;

  private isViewOnly: boolean = false;

  public disabledDates: Date[] = [];
  public disabledWeekDays = [];

  // Country Settings
  private countrySettings = new ICountrySettings();

  /**
   * Creates an instance of OfferPlannerComponent
   *
   * @param injector The injector helper to inject all parent dependencies
   */
  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private securityService: SecurityService
  ) {
    super(injector);
  } // end constructor

  /**
   * Initiates the component
   */
  ngOnInit() {
    this.onInit();
    this.getMyPlants();

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.getCountrySettings();
    }

    this.session.menuApplicationItems.subscribe(
      result => {

        this.selectedPlantDescription = this.translate('rccc.admin.selected_plant_label');
      }
    );
    this.enableActions();
    //  Set if view only
    this.isViewOnly = this.securityService.isViewOnly();
  } // end on init

  getCountrySettings() {
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
      error => this.showBarMessage(this.translate('rccc.settings.business_unit.errors.get_country_error_settings'), 'error')

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

  /**
   * Initiates the view children
   */
  ngAfterViewInit() {
    let dialogsArray = [
      this.cloneDialog,
      this.confirmDialog,
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
        } // end switch
      } // end anonymous function
    ); // end foreach
  } // end function after view init

  /*
  *** Updates the events on datePicker to get non working days on component init
  */ 
  updateDatePicker(){
    this.updatePicker(this.datePicker, this.disabledDates);
  }

  /**
   * Create the form
   */
  private createForm() {
  //    const isDisabled = !this._value.isEditable;
  //  const offeredUnits = this._value.offeredUnits || 0;

    this.formCreated = false;

    if (!this.fleetCapacityItems) {
      console.warn('No fleet capacity items');
    } // end if not fleet capacity items

    let formControls: any = {};
    if (this.fleetCapacityItems) {
      for (let item of this.fleetCapacityItems) {
        formControls['offeredUnits_' + item.fleetId] =
          new FormControl({
            value: item.offeredUnits,
            disabled: false
          });
      } // end for
    } // end if this.fleetCapacityItems

    this.formGroup = this.formBuilder.group(formControls);
    this.formCreated = true;
  } // end function createForm

  /**
   * Set the plant
   */
  setPlant(plant: Plant): void {
    this.plant = plant;
    this.selectedPlantDescription = plant.plantDesc;
    this.getFleetCapacityItems();

    if (this.versionToggle.isSettingsEnabled()) {
      // v2
      this.api.getBusinessUnitSettings(sessionStorage.getItem('country'), this.plant.plantCode).subscribe(
        response => {
          this.disabledDates = [];
          this.disabledWeekDays = [];
  
          if (response) {
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
            this.countrySettings.calendar.nonWorkingDays.forEach(nwd => {
              let numbers = nwd.split('-');
              this.disabledDates.push(new Date(Number(numbers[0]), Number(numbers[1])-1, Number(numbers[2])));
            });
    
            for (let index = 0; index < 7; index++) {
              if (this.checkIfDateIsDisabled(this.countrySettings.calendar.workingDays, index)) {
                this.disabledWeekDays.push(index);
              }
            }
          }
  
          this.api.stopWaiting();
        },
        error => this.showBarMessage(this.translate('rccc.settings.business_unit.errors.get_business_unit_error_settings'), 'error')
      );
    }    
  } // end function set plant

  /**
   * If there's a plant, go for fleet capacity items
   */
  protected onPickDate(): void {
    if (this.plant) {
      this.getFleetCapacityItems();
    } // end this plant
    this.cancelDatePicker();
  } // end on pick date

  /**
   * Refreshed the query
   */
  refresh() {
    this.getFleetCapacityItems();
  } // end function refresh
  /**
   * Saves the current model
   */
  save() {

    //  Set awaiting
    this.api.await();

    this.api.updateFleetCapacityItems(
      this.plant.plantId,
      this.date,
      this.fleetCapacityItems
    ).subscribe(
      response => {
        this.getFleetCapacityItems();
        this.enableActions();
        this.api.stopWaiting();
        this.showBarMessage(this.translate("rccc.alert.model_updated.message"), 'success');
      }, // end on response
      error => this.showBarMessage(error, 'error')
    ); // end subscribe

  } // end function save

  /**
   * Deletes a set of delete capacity check items
   */
  delete() {
    //  Set awaiting
    this.confirmDialog.close();
    this.api.await();
    //  Call the delete api
    this.api.deleteFleetCapacityItems(
      this.plant.plantId,
      this.date
    ).subscribe(
      response => {
        this.getFleetCapacityItems();
        this.enableActions();
        this.api.stopWaiting();
        this.showBarMessage(this.translate("rccc.alert.model_deleted.message"), 'success');
      }, // end on response
      error => this.showBarMessage(error, 'error')
    ); // end subscribe
  } // end function delete

  /**
   * Opens the dialog to copy a model
   */
  openCopyDialog() {
    this.cloneDialog.open();
  } // end function openCopyDialog

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
    this.showConfirm(this.translate('rccc.daily_fleet_capacity.messages.confirm_delation'));
  } // end function confirmDelete

  /**
   * Closes the dialog for confirmation
   */
  closeConfirmDialog() {
    this.confirmDialog.close();
  } // end function closeConfirmDialog

  /**
   * Triggers the api clone capacity check items function
   */
  copyModel() {
    try {
      //  Run validations
      this.validateCopyModel();
      this.cloneDialog.close();

      //  Set awaiting
      this.api.await();
      //  Call the delete api
      this.api.cloneFleetCapacityItems(
        this.plant.plantId,
        this.date,
        this.fromDate,
        this.toDate
      ).subscribe(
        response => {
          this.getFleetCapacityItems();
          this.enableActions();
          this.api.stopWaiting();
          this.showBarMessage(this.translate("rccc.alert.model_cloned.message"));
        }, // end on response
        error => this.showBarMessage(error, 'error')
      ); // end subscribe
    } catch (ex) {
      this.cloneDialog.close();
      console.error(ex);
      this.showBarMessage(ex, 'error');
    } // end try
  } // end function copyModel

  /**
   * Gets myPlants from the api
   */
  getMyPlants() {
    //  Set awaiting
    this.api.await();
    this.api.getMyPlants().subscribe(
      response => { this.myPlants = response; this.api.stopWaiting(); },
      error => { console.error(error); this.api.stopWaiting(); }
    ); // end subscribe
  } // end getMyPlants

  /**
   * Get the capacity items from plant, product type and date
   *
   */
  getFleetCapacityItems() {

    if (this.datePickerError) {
      this.showBarMessage(this.translate('rccc.errors.sunday_error'), "error");
      return;
    } // end if date picker error

    this.canSave = false;
    //  Set awaiting
    this.api.await();
    this.api.getFleetCapacityItems(
      this.plant.plantId,
      this.date
    ).subscribe(
      response => {
        this.pristine = true;
        this.fleetCapacityItems = response;
        this.createForm();
        this.api.stopWaiting();

        this.isNewDataset = true;
        this.isItemsValid = true;
        let offeredUnits = 0;
        let committedUnits = 0;
        this.chartItems = [];
        for (let item of this.fleetCapacityItems) {
          offeredUnits += item.offeredUnits;
          committedUnits += item.committedUnits;
          this.isNewDataset = (this.isNewDataset && (item.capacityId == 0));
          this.chartItems.push([item]);
        } // end for item

        this.areCommitsPresent = (committedUnits > 0);
        this.isDataPresent = (offeredUnits > 0);

        this.enableActions();
      },
      error => {
        this.fleetCapacityItems = [];
        console.error(error);
        this.enableActions();
        this.showBarMessage(error, 'error');
      }
    ); // end subscribe
  } // end function getCapacityItems

  /**
   * Validates the inputs: Plant, material and dates
   */
  protected validateCopyModel() {
    let valid = this.plant && this.plant.plantId && this.date && this.fromDate && this.toDate;
    if (!valid) {
      console.warn(
        [this.plant.plantId,
        this.date,
        this.fromDate,
        this.toDate]
      ); // end console.warn
      throw new Error(this.translate("rccc.clone_dialog.message.not_valid"));
    } // end if not valid

    if ((this.fromDate) && (this.toDate)) {
      if (this.fromDate.getTime() > this.toDate.getTime()) {
        throw new RangeError(this.translate("rccc.errors.labels.fromdate_bigger_todate"));
      } // end if from > to
    } // end if all dates

    let timeDiff: number = Math.abs(this.toDate.getTime() - this.fromDate.getTime());
    var diffDays:number = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays >= 90) {
      throw new RangeError(this.translate('rccc.errors.labels.clone_bigger_90_days'));
    } // end if diff days > 90
  } // end function validateCopyModel

  /**
   * Fires when check items changed
   *
   * @param changed True if changed, false otherwise
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
  private enableActions(): void {
    //  Set all false
    this.canSave = false;
    this.canDelete = false;
    this.canRefresh = false;
    this.canCopyModel = false;

    //  Do the logical calculations
    this.canSave = !this.pristine && this.isItemsValid;
    this.canRefresh = this.isDataPresent && !this.canSave;
    this.canDelete = this.pristine && this.isDataPresent && !this.isNewDataset && !this.areCommitsPresent;
    this.canCopyModel = this.pristine && this.isDataPresent && !this.isNewDataset;

    if (this.canSave) {
      for (let item of this.fleetCapacityItems) {
        if (item.offeredUnits < item.committedUnits) {
          this.canSave = false;
          break;
        }
      } // end for item
    } // end if can save
  } // end function enableActions

  // Debugger
  private debugEnableActions(): void {
    console.log({
      canSave: this.canSave,
      canRefresh: this.canRefresh,
      canDelete: this.canDelete,
      pristine: this.pristine,
      isItemsValid: this.isItemsValid,
      isDataPresent: this.isDataPresent,
      isNewDataset: this.isNewDataset,
      areCommitsPresent: this.areCommitsPresent,
    });
  } // end debugEnableActions

  /**
   * Closes the clone dialog
   */
  private closeCloneDialog() {
    this.cloneDialog.close();
  } // end closeCloneDialog function

  /**
   * Every time the component receive input, update the properties accordingly
   *
   * @param {any} e The event information
   *
   * @return {undefined}
   */
  private onUpdate(e: any, item: any) {

    this.isItemsValid = true;
    this.unitsInvalid = false;
    item.isInvalid = false;
    item.unitsToolTip = '';

    let offeredUnits = Number(e.target.value);

    //  Validate the input
    if (offeredUnits < item.committedUnits) {
      this.isItemsValid = false;
      item.isInvalid = true;
      item.unitsToolTip = this.translate('views.daily_fleet_capacity.tooltip.offered_smaller_committed');
    } // end if less than committed

    if (offeredUnits > this.maxUnits) {
      this.isItemsValid = false;
      item.isInvalid = true;
      item.unitsToolTip = this.translate('views.daily_fleet_capacity.tooltip.max_units_surpassed');
    } // end if max units

    this.unitsInvalid = this.unitsInvalid || item.isInvalid;
    this.pristine = false;
    item.isDirty = true;
    item.offeredUnits = offeredUnits;
    this.enableActions();
  } // end function onKeyUp
}