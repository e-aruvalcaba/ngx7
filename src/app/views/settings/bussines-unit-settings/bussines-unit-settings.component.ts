import { Component, OnInit, Injector, QueryList, ViewChildren } from '@angular/core';
import { PlantCapacityComponent } from '../../plant-capacity/plant-capacity.component';
import { IBusinessUnitSettings } from '../../../models/business-unit-settings.interface';
import { AlertService } from '@cemex/cmx-alert-v7';//updated from v2
import { ICountrySettings, IGeolocationServices, ProductType, ShippingType, ShippingCondition, LoadingTime, CompensationTime, ReactionTime, GeolocationService } from '../../../models/country-settings.interface';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Plant } from '../../../models/plant';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
import { CmxWeekDays } from '../../../models/cmx-weekdays.enum';
import { CmxCalendarService } from '../../../services/cmx-calendar.service';


@Component({
  selector: 'app-bussines-unit-settings',
  templateUrl: './bussines-unit-settings.component.html',
  styleUrls: ['./bussines-unit-settings.component.scss']
})
export class BussinesUnitSettingsComponent extends PlantCapacityComponent {
  private countryCode: string = sessionStorage.getItem('country');
  private countrySettings = new ICountrySettings();
  private businessUnitSettings: IBusinessUnitSettings;
  private copyBusinessUnitSettings: IBusinessUnitSettings;
  private nonWorkingDaysDialog: CmxDialogComponent;
  private nonWorkingDates: Date[] = [];
  private workingWeekDays: CmxWeekDays[] = [];
  private currentYear: number = (new Date().getFullYear());
  private weekStartAt: CmxWeekDays = CmxWeekDays.Monday;
  private configuredPlants: any;
  private sortDirection = 1;
  private editing = false;
  private currentPlant: Plant;
  private canSave: boolean = false;
  private enableSave: boolean = true;

  @ViewChildren(CmxDialogComponent) dialogs: QueryList<CmxDialogComponent>;

  private geolocationServices: IGeolocationServices;
  private weekDays = this.translate('global.dayNames').split(',');
  private monthDays = this.translate('global.monthNames').split(',');

  constructor(injector: Injector, private alertService: AlertService) {
    super(injector);
  }

  private updateWeekWorkingDays() {
    this.workingWeekDays = [];
    let workingDays: number = this.businessUnitSettings.calendar.workingDays;
    let binval: number = 64;
    let temp: number;
    let i: number
    for (i=7; i>=1; i--) {
      temp = workingDays - binval;
      if (temp >= 0) {
        workingDays = temp;
        this.workingWeekDays.push(i);
      } // end if temp >= 0
      binval = binval / 2;
    } // end for each day

  } // end funciton updateWeekWorkingDays

  ngOnInit(): void {
    this.api.await();
    let getCountrySettings = this.api.getCountrySettings(this.countryCode);
    let getPlants = this.api.getMyPlants();
    let getGeolocationServices = this.api.getGeolocationServices();
    let getConfiguredPlants = this.api.getConfiguredPlants(this.countryCode);

    forkJoin([
      getCountrySettings,
      getPlants,
      getGeolocationServices,
      getConfiguredPlants])
    .subscribe(
      response => {

        this.weekDays = this.translate('global.dayNames').split(',');
        this.monthDays = this.translate('global.monthNames').split(',');
        let countrySettings: any = response[0];
        let plants: any = response[1];
        let geolocationServices: any = response[2];
        let configuredPlants: any = response[3];
        // let appClients: any = response[4]; // Error no value [4]

        if (!countrySettings) {
          console.error("No country settings");
          return;
        } // end if no country settings
        this.countrySettings = countrySettings;
        this.myPlants = plants;
        geolocationServices.geolocationServices = geolocationServices.geolocationServices.filter(gs => gs.geolocationServiceId == 1);
        this.geolocationServices = geolocationServices;
        this.configuredPlants = configuredPlants;

        this.countrySettings.productTypes.forEach(product => {
          product.selected = true;
        });

        this.countrySettings.shippingTypes.forEach(ship => {
          ship.selected = true;
        });

        this.countrySettings.shippingConditions.forEach(ship => {
          ship.selected = true;
        });
        this.api.stopWaiting();
      },
      error => {
        this.alertService.openError(this.translate('rccc.catalogs.message.errors.load_data'),
        this.translate('rccc.errors.try_again_later'), 5000);
        this.api.stopWaiting();
      }
    );

    this.currentPlant=null;
  }

  ngAfterViewInit() {
    this.dialogs.forEach(
      (dialog, index) => {
        switch (index) {
          case 0:
            this.nonWorkingDaysDialog = dialog;
          break;
        }
      }
    );
  }

  private setBusinessUnitSettingsCompensationTime(): void {

    let newCompensationTimes: CompensationTime[] = [];

    this.geolocationServices.geolocationServices.forEach(geo => {
      let compTimes = this.businessUnitSettings.compensationTimes
        .find(x => {
          if (x.geolocationService) {
            return x.geolocationService.geolocationServiceId == geo.geolocationServiceId;
          } else {
            return false;
          }
        });

      if (compTimes) {
        // geo.calculationTypeId = compTimes.calculationTypeId;
        geo.calculationTypeId = compTimes.calculationTypeId;
        geo.compensationTime = compTimes.compensationTime;
      } else {
        geo.calculationTypeId = 1;
        geo.compensationTime = 0;
      }

      let nct: CompensationTime = {
        shippingTypeId: 1,
        geolocationService: geo,
        calculationTypeId: geo.calculationTypeId,
        compensationTime: geo.compensationTime
      }

      newCompensationTimes.push(nct);
    });

    this.businessUnitSettings.compensationTimes = newCompensationTimes;
  } // end function setBusinessUnitSettingsCompensationTime

  private getBusinessUnitSettings(plantCode: string) {
    this.api.getBusinessUnitSettings(this.countryCode, plantCode).subscribe(
      response => {
        this.businessUnitSettings = response;
        if (!this.businessUnitSettings) {
          this.businessUnitSettings = {
              plantCode: plantCode,
              commercialManagement: false,

              productTypes: [],
              shippingTypes: [],
              shippingConditions: [],
              compensationTimes: [],
              reactionTimes: [],
              loadingTimes: [],
              calendar: {
                workingDays: 0,
                nonWorkingDays: []
              }
          };
        }

        // this.api.stopWaiting();
        this.updateWeekWorkingDays();

        this.countrySettings.productTypes.sort(
          (a, b) => a.productTypeCode < b.productTypeCode ? -1 : a.productTypeCode > b.productTypeCode ? 1 : 0
        );

        for (let pt of this.countrySettings.productTypes) {
          var itsThere = this.businessUnitSettings.productTypes
            .find(x => x.productTypeId == pt.productTypeId);

          if (pt.selected && itsThere == undefined) {
            this.businessUnitSettings.productTypes.push(pt);
          }
        }

        this.countrySettings.shippingConditions.forEach(sc => {
          var itsThere = this.businessUnitSettings.shippingConditions
            .find(x => x.shippingConditionId == sc.shippingConditionId);

          if (sc.selected && itsThere == undefined) {
            this.businessUnitSettings.shippingConditions.push(sc);
          }
        });

        this.countrySettings.shippingTypes.forEach(st => {
          var itsThere = this.businessUnitSettings.shippingTypes
            .find(x => x.shippingTypeId == st.shippingTypeId);

          if (st.selected && itsThere == undefined) {
            this.businessUnitSettings.shippingTypes.push(st);
          }
        });

        this.setBusinessUnitSettingsCompensationTime();
      },
      error => {
        this.alertService.openError(this.translate('rccc.settings.business_unit.errors.get_business_unit_error_settings'),
        this.translate('rccc.errors.try_again_later'), 5000);
      }
    );
  }

  checkIfConfigured(plant: Plant) {
    let ret = false;

    if (this.configuredPlants) {
      this.configuredPlants.plants.forEach(conf => {
        if (conf.plantCode == plant.plantCode) {
          ret = true;
        }
      });
    }

    return ret;
  }

  sortBy(header: number) {
    this.sortDirection *= -1;

    if (header == 0) {
      this.myPlants.sort((pl1, pl2) => (pl1.plantDesc > pl2.plantDesc) ? this.sortDirection : -1*this.sortDirection);
    } else {
      this.myPlants.sort((pl1, pl2) => (this.checkIfConfigured(pl1) > this.checkIfConfigured(pl2)) ? this.sortDirection : -1*this.sortDirection);
    }
  }

  editBUSettings(plant: Plant) {
    this.editing = true;
    this.currentPlant = plant;

    if (this.checkIfConfigured(plant)) {
      this.getBusinessUnitSettings(plant.plantCode);
    } else {
      this.businessUnitSettings = {
        plantCode: plant.plantCode,
        commercialManagement: this.api.cloneObject(this.countrySettings.commercialManagement),
        productTypes: this.api.cloneObject(this.countrySettings.productTypes),
        shippingTypes: this.api.cloneObject(this.countrySettings.shippingTypes),
        shippingConditions: this.api.cloneObject(this.countrySettings.shippingConditions),
        compensationTimes: this.api.cloneObject(this.countrySettings.compensationTimes),
        reactionTimes: this.api.cloneObject(this.countrySettings.reactionTimes),
        loadingTimes: this.api.cloneObject(this.countrySettings.loadingTimes),
        calendar: this.api.cloneObject(this.countrySettings.calendar)
      }; // end set default business unit settings
      this.setBusinessUnitSettingsCompensationTime();
    } // end if then else check if configured plant
  } // end editBUSettings

  copyBUSettings(plant: Plant) {
    if (this.checkIfConfigured(plant)) {
      this.api.getBusinessUnitSettings(this.countryCode, plant.plantCode).subscribe(
        response => {
          this.copyBusinessUnitSettings = response;
          this.showBarMessage(this.translate('digital_confirmation.settings.lbl_copied_BU_settings'), 'info');
        },
        error => {
          this.alertService.openError(this.translate('rccc.settings.business_unit.errors.copy_business_unit_error_settings'),
          this.translate('rccc.errors.try_again_later'), 5000);
        }
      );
    } else {
      this.copyBusinessUnitSettings = {
        plantCode: plant.plantCode,
        commercialManagement: this.countrySettings.commercialManagement,
        productTypes: this.countrySettings.productTypes,
        shippingTypes: this.countrySettings.shippingTypes,
        shippingConditions: this.countrySettings.shippingConditions,
        compensationTimes: this.countrySettings.compensationTimes,
        reactionTimes: this.countrySettings.reactionTimes,
        loadingTimes: this.countrySettings.loadingTimes,
        calendar: this.countrySettings.calendar
      };

      this.showBarMessage(this.translate('digital_confirmation.settings.lbl_copied_BU_settings'), 'info');
    }
  }

  pasteBUSettings(plant: Plant) {
    this.copyBusinessUnitSettings.plantCode = plant.plantCode;

    this.api.updateBusinessUnitSettings(this.countryCode, plant.plantCode, this.copyBusinessUnitSettings).subscribe(
      response => {
        if (response) {
          this.editing = false;
          this.getConfiguredPlants();
          this.showBarMessage(this.translate('digital_confirmation.settings.lbl_updated_BU_settings'),'info');
        } else {
          this.showBarMessage(this.translate('rccc.settings.business_unit.errors.response_business_unit_error_settings'),'error');
        }
      },
      error => {
        this.showBarMessage(this.translate('rccc.settings.business_unit.errors.response_business_unit_error_settings'),'error');
      }
    );
  }

  getConfiguredPlants() {
    this.api.getConfiguredPlants(this.countryCode).subscribe(
      response => {
        this.configuredPlants = response;
      },
      error => {
        this.showBarMessage(this.translate('rccc.settings.business_unit.errors.get_cnf_plants_error_settings'),'error');
      }
    );
  }

  // ============================================================================================================

  enableMaterial(material: ProductType): void {
    material.selected = !material.selected;

    if (material.selected) {
      var mt: ProductType = {
        productTypeId: material.productTypeId,
        productTypeCode: material.productTypeCode,
        productTypeDesc: material.productTypeDesc,
        selected: material.selected
      };

      this.businessUnitSettings.productTypes.push(mt);
    }
    else {
      var mtIndex = this.businessUnitSettings.productTypes
        .findIndex(x => x.productTypeId == material.productTypeId);

      this.businessUnitSettings.productTypes.splice(mtIndex, 1);
    }
  }

  enableShippingType(shippingType: ShippingType) {
    shippingType.selected = !shippingType.selected;

    if (shippingType.selected) {
      var st: ShippingType = {
        shippingTypeId: shippingType.shippingTypeId,
        shippingTypeCode: shippingType.shippingTypeCode,
        shippingTypeDesc: shippingType.shippingTypeDesc,
        selected: shippingType.selected
      };

      this.businessUnitSettings.shippingTypes.push(st);
    }
    else {
      var stIndex = this.businessUnitSettings.shippingTypes
        .findIndex(x => x.shippingTypeId == shippingType.shippingTypeId);

      if (stIndex > -1) {
        this.businessUnitSettings.shippingTypes.splice(stIndex, 1);
      } // end if stIndex > -1
    }
  }

  enableShippingCondition(shippingCond: ShippingCondition) {
    shippingCond.selected = !shippingCond.selected;

    if (shippingCond.selected) {
      var sc: ShippingCondition = {
        shippingConditionId: shippingCond.shippingConditionId,
        shippingConditionCode: shippingCond.shippingConditionCode,
        shippingConditionDesc: shippingCond.shippingConditionDesc,
        selected: shippingCond.selected
      };

      this.businessUnitSettings.shippingConditions.push(sc);
    }
    else {
      var scIndex = this.businessUnitSettings.shippingConditions
        .findIndex(x => x.shippingConditionId == shippingCond.shippingConditionId);

      if (scIndex > -1) {
      this.businessUnitSettings.shippingConditions.splice(scIndex, 1);
      } // end if scIndex > -1
    }
  }

  // ============================================================================================================
  // Calendar

  checkCalendar(day: number):boolean {
    if (this.businessUnitSettings) {
      let binary: number[] = new Array(7);

      let n = this.businessUnitSettings.calendar.workingDays;
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

      return binary[day-1] == 1;
    }

    return true;
  }

  updateCalendar(day: number) {
    if (this.businessUnitSettings.calendar) {
      let binary: number[] = new Array(7);

      let n = this.businessUnitSettings.calendar.workingDays;
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

      let replaceValue = this.checkCalendar(day) ? 0 : 1;
      binary[day-1] = replaceValue;

      let workingDays = 0;
      value = 64;
      for (let i = 0; i < binary.length; i++) {
        workingDays += binary[i] * value;
        value /= 2;
      }

      this.businessUnitSettings.calendar.workingDays = workingDays;
      this.updateWeekWorkingDays();
    }
  }

  getFormattedDate(date: string): string {
    let numbers = date.split('-');
    return this.monthDays[parseInt(numbers[1])-1] + ' ' + numbers[2];
  }

  deleteDate(date: string) {
    var index = this.businessUnitSettings.calendar.nonWorkingDays
      .findIndex(x => x == date);

    this.businessUnitSettings.calendar.nonWorkingDays.splice(index, 1);
    this.nonWorkingDates = [];
    this.nonWorkingDates = this.businessUnitSettings.calendar.nonWorkingDays.map(nwd=> new Date(nwd));
  }

  addNonWorkingDay() {
    this.nonWorkingDates = [];

    this.businessUnitSettings.calendar.nonWorkingDays.forEach(nwd => {
      let numbers = nwd.split('-');

      if (Number(numbers[0]) != this.currentYear) {
        nwd = this.currentYear + '-' + numbers[1] + '-' + numbers[2];
      }

      let date = new Date();
      date.setDate(Number(numbers[2]));
      date.setMonth(Number(numbers[1])-1);
      this.nonWorkingDates.push(date);
    });

    this.nonWorkingDaysDialog.open();
  }

  private closeNonWorkingDay() {
    this.businessUnitSettings.calendar.nonWorkingDays = [];

    if (this.nonWorkingDates) {
      this.nonWorkingDates.forEach(nwd => {
        let fixedDate = nwd.getFullYear() + '-' + (nwd.getMonth()+1) + '-' + nwd.getDate();
        this.businessUnitSettings.calendar.nonWorkingDays.push(fixedDate);
      });
    }

    this.nonWorkingDaysDialog.close();
  }

  private selectDay($event: any): void {
    this.nonWorkingDates = $event;
  }

  // ============================================================================================================
  // Compensation times

  changeCalcType(type: number, geo: GeolocationService) {
    geo.calculationTypeId = type;

    this.businessUnitSettings.compensationTimes
      .find(x => x.geolocationService.geolocationServiceId == geo.geolocationServiceId).calculationTypeId = type;
  }

  changeCompensationTime(geo: GeolocationService) {
    var compTime = this.businessUnitSettings.compensationTimes
      .find(x => {
        if (x.geolocationService) {
          return x.geolocationService.geolocationServiceId == geo.geolocationServiceId;
        } else {
          return false;
        }
      });

    if (compTime) {
      compTime.compensationTime = geo.compensationTime;
    }
  }

  // ============================================================================================================
  // Reaction and Loading Time

  getReactionTime(shippingConditionId: number, materialTypeId: number):number {
    let reaction = 0;

    this.businessUnitSettings.reactionTimes.forEach(rt => {
      if (rt.shippingConditionId == shippingConditionId && rt.productTypeId == materialTypeId) {
        reaction = rt.reactionTime;
        return;
      }
    });

    return reaction;
  }

  addReactionTime(shippingConditionId: number, materialTypeId: number, event: any) {
    let rt = this.businessUnitSettings.reactionTimes
      .find(x => x.productTypeId == materialTypeId && x.shippingConditionId == shippingConditionId);

    if (rt) {
      rt.reactionTime = event.srcElement.value;
    } else {
      rt = {
        shippingConditionId: shippingConditionId,
        productTypeId: materialTypeId,
        reactionTime: Number(event.srcElement.value)
      };

      this.businessUnitSettings.reactionTimes.push(rt);
    }
  }

  getLoadingTime(shippingTypeId: number, materialTypeId: number):number {
    let loading = 0;

    this.businessUnitSettings.loadingTimes.forEach(lt => {
      if (lt.shippingTypeId == shippingTypeId && lt.productTypeId == materialTypeId) {
        loading = lt.loadingTime;
        return;
      }
    });

    return loading;
  }

  addLoadingTime(shippingTypeId: number, materialTypeId: number, event: any) {
    let lt = this.businessUnitSettings.loadingTimes
      .find(x => x.productTypeId == materialTypeId && x.shippingTypeId == shippingTypeId);

    if (lt) {
      lt.loadingTime = event.srcElement.value;
    } else {
      lt = {
        shippingTypeId: shippingTypeId,
        productTypeId: materialTypeId,
        loadingTime: Number(event.srcElement.value)
      };

      this.businessUnitSettings.loadingTimes.push(lt);
    }
  }

  // ============================================================================================================
  // Validity

  checkValidity(value: number, min: number, max: number): boolean {
    this.canSave = (value <= max && value >= min);
    return !this.canSave;
  }

  checkValidityReaction(shippingConditionId: number, materialTypeId: number, min: number, max: number): boolean {
    let value = 120;

    this.businessUnitSettings.reactionTimes.forEach(rt => {
      if (rt.shippingConditionId == shippingConditionId && rt.productTypeId == materialTypeId) {
        value = rt.reactionTime;
        return;
      }
    });

    this.canSave = (value <= max && value >= min);
    return !this.canSave;
  }

  checkValidityLoading(shippingTypeId: number, materialTypeId: number, min: number, max: number): boolean {
    let value = 60;

    this.businessUnitSettings.loadingTimes.forEach(rt => {
      if (rt.shippingTypeId == shippingTypeId && rt.productTypeId == materialTypeId) {
        value = rt.loadingTime;
        return;
      }
    });

    this.canSave = (value <= max && value >= min);
    return !this.canSave;
  }

  /**
   * Validates settings
   *
   * @param settings IBusinessUnitSettings the settings to validate
   *
   * @return boolean
   */
  validateSettings (settings: IBusinessUnitSettings): boolean {

    let warningMessage: string = "";

    if (!settings || !settings.hasOwnProperty("plantCode")) {
      console.warn("No plantcode, no businessunit settings");
      return false;
    } // end if no settings

    try {

      //Validate undefined data objects
      if (settings.productTypes && settings.shippingTypes && settings.shippingConditions) {
        if (settings.productTypes.length == 0) {
          warningMessage = this.translate('digital_confirmation.errors.at_least_one_producttype');
          throw new Error(warningMessage);
        }


        if (settings.shippingTypes.length == 0) {
          warningMessage = this.translate('digital_confirmation.errors.at_least_one_shippingtype');
          throw new Error(warningMessage);
        }

        if (settings.shippingConditions.length == 0) {
          warningMessage = this.translate('digital_confirmation.errors.at_least_one_shippingcondition');
          throw new Error(warningMessage);
        }
      }

      if (settings.compensationTimes) {
        settings.compensationTimes.map(rt => rt.compensationTime = Number(rt.compensationTime));
        settings.compensationTimes.forEach(ct => {
          var max = ct.calculationTypeId == 1 ? 1440 : 100;

          if (!(ct.compensationTime <= max && ct.compensationTime >= 0) || !Number.isInteger(ct.compensationTime)) {
            warningMessage = this.translate('digital_confirmation.errors.invalid_compensation_time');
            throw new Error(warningMessage);
          }
        });
      }

      if (settings.reactionTimes) {
        settings.reactionTimes.map(rt => rt.reactionTime = Number(rt.reactionTime));
        settings.reactionTimes.forEach(rt => {
          if (!(rt.reactionTime <= 360 && rt.reactionTime >= 0) || !Number.isInteger(rt.reactionTime)) {
            warningMessage = this.translate('digital_confirmation.errors.invalid_reaction_time');
            throw new Error(warningMessage);
          }
        });
      }

      if (settings.loadingTimes) {
        settings.loadingTimes.map(rt => rt.loadingTime = Number(rt.loadingTime));
        settings.loadingTimes.forEach(lt => {
          if (!(lt.loadingTime <= 360 && lt.loadingTime >= 1) || !Number.isInteger(lt.loadingTime)) {
            warningMessage = this.translate('digital_confirmation.errors.invalid_loading_time');
            throw new Error(warningMessage);
          }
        });
      }

      if (settings.calendar.workingDays == 0) {
        warningMessage = this.translate('digital_confirmation.errors.at_least_one_working_day');
        throw new Error(warningMessage);
      }

      return true;
    } catch (warning) {
      console.warn(warning);
      this.showBarMessage(warning, 'warning');
      return false;
    } //end try catch
  } // end function validateSettings

  synchronizeBUSettings(buSettings: IBusinessUnitSettings, countrySettings: ICountrySettings) {
    let data=[], found;
    
    buSettings.productTypes.map(value => {
      found = countrySettings.productTypes.find(x => x.productTypeId === value.productTypeId);
      if (found) { //Is the value evaluating in the countrySettings array?
        data.push(found);
      }
    })
    //Set new product types values
    buSettings.productTypes = data;
    data=[];
    buSettings.shippingConditions.map(value => {
      found = countrySettings.shippingConditions.find(x => x.shippingConditionId == value.shippingConditionId);
      if (found) {
        data.push(found);
      }
    })
    //Set new shippingConditions values
    buSettings.shippingConditions = data;
    data=[];
    buSettings.shippingTypes.map(value => {
      found = countrySettings.shippingTypes.find(x => x.shippingTypeId == value.shippingTypeId);
      if (found) {
        data.push(found);
      }
    })
    // Set new shippingTypes values
    buSettings.shippingTypes = data;
  }

  /**
   * Validates and saves the settings
   *
   * @return void
   */
  onSave(): void {
    try {

      if (!this.validateSettings(this.businessUnitSettings)) {
        console.warn('not valid');
        return;
      } // end if not validateSettings
      this.synchronizeBUSettings(this.businessUnitSettings, this.countrySettings);

      this.api.updateBusinessUnitSettings(this.countryCode, this.currentPlant.plantCode, this.businessUnitSettings).subscribe(
        response => {
          if (response) {
            this.editing = false;
            this.getConfiguredPlants();
            this.showBarMessage(this.translate('digital_confirmation.settings.lbl_updated_BU_settings'), 'info');

            //Clear
            this.currentPlant = null;
          } else {
            this.showBarMessage(this.translate('rccc.settings.business_unit.errors.response_business_unit_error_settings'), 'error');
          }
        },
        error => {
          this.showBarMessage(this.translate('rccc.settings.business_unit.errors.response_business_unit_error_settings'), 'error');
        }
      );
    }
    catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Validates the values that user types on Number Field Form
   */
  checkUserInput(e){
    //Permited values on the inputs numbers 0 - 9, position arrows up, down, left, right and backspace key.
    let ascii=[8, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    return (ascii.find(x => x==e.keyCode) != undefined) && e.keycode!=186; //186 ascii code is for ´´ key that have a bug for inputs.
  }
}