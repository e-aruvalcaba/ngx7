import { Component, OnInit, Injector, ViewChildren, QueryList, /*group,*/ ElementRef, ViewChild } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { PlantCapacityComponent } from '../../plant-capacity/plant-capacity.component';
import { ICountrySettings, IMaterialTypes, MaterialType, IApplicationClients, IDeliveryWindows,
         IGeolocationServices, IDigitalConfirmationProcesses, IProductTypes, IShippingTypes, 
         IShippingConditions, ShippingType, ShippingCondition, DeliveryTimeCommitment, IWindow, 
         CompensationTime, ReactionTime, LoadingTime, ProductType, ReservationTime, GeolocationService, DeliveryWindow 
        } from '../../../models/country-settings.interface';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4
import { CmxCalendarService } from '../../../services/cmx-calendar.service';
import { CmxWeekDays } from '../../../models/cmx-weekdays.enum';
import { sampleTime } from 'rxjs/operator/sampleTime';
import { fakeAsync } from '@angular/core/testing';
import { MATERIAL_TYPES } from '../../../data/material-types';
import { TRANSPORTATION_MODES } from '../../../data/transportation-modes';

@Component({
  selector: 'country-settings',
  templateUrl: './country-settings.component.html',
  styleUrls: ['./country-settings.component.scss']
})
export class CountrySettingsComponent extends PlantCapacityComponent {

  @ViewChild('content') private content: ElementRef;
  private _countryCode: string = this.api.getCountryCode();
  private countrySettings = new ICountrySettings();
  private materialTypes: IProductTypes;
  private applicationClients: IApplicationClients;
  private deliveryWindows: IDeliveryWindows;
  private geolocationServices: IGeolocationServices;
  private DCProcesses: IDigitalConfirmationProcesses;
  // private productTypes: IProductTypes;
  private shippingTypes: IShippingTypes
  private shippingConditions: IShippingConditions;

  private canSave: boolean = false;
  private canSaveDynamicWindowHorizon: boolean = false;
  private canSaveDeliveryTimeCommitmentWindows: boolean = false;

  //for window exclusive use
  private _startAt:string="00:00";
  private _endAt:string="00:59";
  private _startAtDirty = false;
  private _endAtDirty = false;
  private winDuration:number;
  private tempwindow: IWindow = null;

  @ViewChildren(CmxDialogComponent) dialogs: QueryList<CmxDialogComponent>;
  private nonWorkingDaysDialog: CmxDialogComponent;
  private weekStartAt: CmxWeekDays = CmxWeekDays.Monday;
  private workingWeekDays: CmxWeekDays[] = [];
  private nonWorkingDates: Date[] = [];
  private currentYear: number = (new Date().getFullYear());
  private windowDialog: CmxDialogComponent;
  private newWindowDialog: CmxDialogComponent;
  private dynamicWindowDialog: CmxDialogComponent;
  private dynamicWindowHorizon: number = 1;
  private currentDynamicWindowShippingConditionId: number = 0;
  private currentDynamicWindowMaterialTypeId: number = 0;
  private currentWindowShippingConditionId: number = 0;
  private currentWindowMaterialTypeId: number = 0;
  private windows: IWindow[] = [{
    windowNumber: 1,
    startAt: "00:00",
    endAt: "00:59",
    duration: 0
  }];
  private startAt: string[] = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"];

  private endAt: string[] = [
    "00:59",
    "01:59",
    "02:59",
    "03:59",
    "04:59",
    "05:59",
    "06:59",
    "07:59",
    "08:59",
    "09:59",
    "10:59",
    "11:59",
    "12:59",
    "13:59",
    "14:59",
    "15:59",
    "16:59",
    "17:59",
    "18:59",
    "19:59",
    "20:59",
    "21:59",
    "22:59",
    "23:59"];

  private weekDays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  private monthDays: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  private warningMessage: string = "";

  constructor(injector: Injector) {
    super(injector);
  }

  private updateWeekWorkingDays() {
    this.workingWeekDays = [];
    let workingDays: number = this.countrySettings.calendar.workingDays;
    let binval: number = 64;
    let temp: number;
    let i: number
    for (i = 7; i >= 1; i--) {
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
    let getCountrySettings = this.api.getCountrySettings(this._countryCode);
    let getProductTypes = this.api.getProductTypesForSettings();
    let getShippingTypes = this.api.getShippingTypes();
    let getShippingConditions = this.api.getShippingConditions();
    let getGeolocationServices = this.api.getGeolocationServices();
    let getApplicationClients = this.api.getApplicationClients();
    let getDeliveryWindows = this.api.getDeliveryWindows();
    let getDCProcesses = this.api.getDigitalConfirmationProcesses();

    forkJoin([getCountrySettings,
      getProductTypes,
      getShippingTypes,
      getShippingConditions,
      getGeolocationServices,
      getApplicationClients,
      getDeliveryWindows])
      .subscribe(
        response => {

          this.weekDays = this.translate('global.dayNames').split(',');
          this.monthDays = this.translate('global.monthNames').split(',');
          let countrySettings: any = response[0];
          let enabledMaterialTypes: any = response[1];
          let shippingTypes: any = response[2];
          let shippingConditions: any = response[3];
          let geolocationServices: any = response[4];
          let appClients: any = response[5];
          let deliveryWindows: any = response[6];

          if (!enabledMaterialTypes || !shippingTypes || !shippingConditions || !geolocationServices || !appClients || !deliveryWindows) {
            this.showBarMessage(this.translate('rccc.errors.generic_message'), 'error');
            this.canSave = false;
            return;
          }

          enabledMaterialTypes.productTypes.map(pt => pt.productTypeDesc = MATERIAL_TYPES[pt.productTypeCode]);
          shippingTypes.shippingTypes.map(st => st.shippingTypeDesc = TRANSPORTATION_MODES[st.shippingTypeCode]);
          this.materialTypes = enabledMaterialTypes;
          this.materialTypes.productTypes.sort(
            (a, b) => a.productTypeCode < b.productTypeCode ? -1 : a.productTypeCode > b.productTypeCode ? 1 : 0
          );

          let productTypeCodes: string[]=[];
          this.api.getDailyPlantCapacityProductTypes().subscribe(value => {
              value.map(x => {
                productTypeCodes.push(x.productTypeCode)
              }); 
          });

          console.log("-----------------------------------------");
          console.log("-----------------------------------------");
          console.log("productTypeCodes");
          console.log(productTypeCodes);
          console.log("-----------------------------------------");
          console.log("-----------------------------------------");
          

          this.materialTypes.productTypes =
            this.materialTypes.productTypes.filter(
              pt => productTypeCodes.includes(pt.productTypeCode)
            ); // end filter

            console.log("-----------------------------------------");
            console.log("materialTypes.productTypes");
            console.log(this.materialTypes);
            console.log("-----------------------------------------");
  

          shippingTypes.shippingTypes = shippingTypes.shippingTypes.filter(st => st.shippingTypeId == 1);
          this.shippingTypes = shippingTypes;
          shippingConditions.shippingConditions = this.api.getEnvShippingConditions();
          this.shippingConditions = shippingConditions;
          geolocationServices.geolocationServices = geolocationServices.geolocationServices.filter(gs => gs.geolocationServiceId == 1);
          this.geolocationServices = geolocationServices;
          this.applicationClients = appClients;
          this.deliveryWindows = deliveryWindows;

          if (countrySettings) {
            this.countrySettings = countrySettings;
          } else {

            let defaultProductTypes: ProductType[] = [];
            for (let productType of this.materialTypes.productTypes) {
              defaultProductTypes.push({
                productTypeId: productType.productTypeId,
                productTypeCode: productType.productTypeCode,
                productTypeDesc: productType.productTypeDesc,
                selected: true
              }); // end push
            } // end for each product type

            let defaultShippingConditions: ShippingCondition[] = [];
            for (let shippingCondition of this.shippingConditions.shippingConditions) {
              defaultShippingConditions.push({
                shippingConditionId: shippingCondition.shippingConditionId,
                shippingConditionCode: shippingCondition.shippingConditionCode,
                shippingConditionDesc: shippingCondition.shippingConditionDesc,
                selected: shippingCondition.selected
              });
            } // end for each shipping condition

            let defaultShippingTypes: ShippingType[] = [];
            for (let shippingType of this.shippingTypes.shippingTypes) {
              defaultShippingTypes.push({
                shippingTypeId: shippingType.shippingTypeId,
                shippingTypeCode: shippingType.shippingTypeCode,
                shippingTypeDesc: shippingType.shippingTypeDesc,
                selected: shippingType.selected
              }); // end push
            } // end for each shipping type

            this.countrySettings = {
              countryCode: this._countryCode,
              counterOfferNumber: 3,
              counterOfferHorizon: 72,
              commercialManagement: false,
              multiOfferQuantity: 3,
              multiOfferHorizon: 72,
              enableFleet: false,
              fleet: {
                enableCoverage: false
              },

              productTypes: defaultProductTypes,
              shippingTypes: defaultShippingTypes,
              shippingConditions: defaultShippingConditions,
              reservationTimes: [],
              compensationTimes: [],
              reactionTimes: [],
              loadingTimes: [],
              deliveryTimeCommitments: [],
              appointmentTimeCommitments: [],
              calendar: {
                workingDays: 0,
                nonWorkingDays: []
              }
            }
          }

          this.updateWeekWorkingDays();
          this.nonWorkingDates = this.countrySettings.calendar.nonWorkingDays.map(nwd => new Date(nwd));

          let newReservationTimes: ReservationTime[] = [];

          this.applicationClients.applicationClients.forEach(client => {
            let resTime = this.countrySettings.reservationTimes
              .find(x => {
                if (x.applicationClient) {
                  return x.applicationClient.applicationClientId == client.applicationClientId;
                } else {
                  return false;
                }
              });

            if (resTime) {
              client.reservationTime = resTime.reservationTime;
            } else {
              client.reservationTime = 5;
            }

            let nrt: ReservationTime = {
              applicationClient: client,
              reservationTime: client.reservationTime
            }

            newReservationTimes.push(nrt);
          });

          let newCompensationTimes: CompensationTime[] = [];

          this.geolocationServices.geolocationServices.forEach(geo => {
            let compTimes = this.countrySettings.compensationTimes
              .find(x => {
                if (x.geolocationService) {
                  return x.geolocationService.geolocationServiceId == geo.geolocationServiceId;
                } else {
                  return false;
                }
              });

            if (compTimes) {
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

          this.countrySettings.reservationTimes = newReservationTimes;
          this.countrySettings.compensationTimes = newCompensationTimes;

          this.materialTypes.productTypes.forEach(materialType => {
            var mt = this.countrySettings.productTypes
              .find(x => x.productTypeId == materialType.productTypeId);

            if (mt) {
              materialType.selected = true;
            }
          });

          this.shippingTypes.shippingTypes.forEach(shippingType => {
            var st = this.countrySettings.shippingTypes
              .find(x => x.shippingTypeId == shippingType.shippingTypeId)

            if (st) {
              shippingType.selected = true;
            }
          })

          this.shippingConditions.shippingConditions.forEach(shipCond => {
            var sc = this.countrySettings.shippingConditions
              .find(x => x.shippingConditionId == shipCond.shippingConditionId)
            if (sc) {
              shipCond.selected = true;
            }
          })

          if (this.countrySettings.productTypes.length == 0 ||
            this.countrySettings.shippingTypes.length == 0 ||
            this.countrySettings.shippingConditions.length == 0 ||
            this.geolocationServices.geolocationServices.length == 0
          ) {
            this.canSave = false;
          } else {
            this.canSave = true;
          }
          this.api.stopWaiting();
        },
        error => {
          console.error(error);
          this.api.stopWaiting();
        }
      )

    //Initializate country calendar for Validation
    if (!this.countrySettings.calendar) {
      this.countrySettings.calendar = {
        workingDays: 0,
        nonWorkingDays: []
      }
    } else {
      this.countrySettings.calendar = this.countrySettings.calendar;
    }

    this.warningMessage = "";

    
  }//End on init

  ngAfterViewInit() {
    // this.dialogs.forEach(
    //   (dialog, index) => {
    //     switch (index) {
    //       case 0:
    //         this.windowDialog = dialog;
    //         break;
    //       case 1:
    //         this.newWindowDialog = dialog;
    //         break;
    //       case 2:
    //         this.dynamicWindowDialog = dialog;
    //         break;
    //       case 3:
    //         this.nonWorkingDaysDialog = dialog;
    //         break;
    //     }
    //   }
    // ); //Error ExpressionChangedAfterItHasBeenChecked selectedid:undefined current selectedid:0 
  } // end after view init

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

      this.countrySettings.productTypes.push(mt);
    }
    else {
      var mtIndex = this.countrySettings.productTypes
        .findIndex(x => x.productTypeId == material.productTypeId);

      this.countrySettings.productTypes.splice(mtIndex, 1);
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

      this.countrySettings.shippingTypes.push(st);
    }
    else {
      var stIndex = this.countrySettings.shippingTypes
        .findIndex(x => x.shippingTypeId == shippingType.shippingTypeId);

      if (stIndex > -1) {
        this.countrySettings.shippingTypes.splice(stIndex, 1);
      }
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

      this.countrySettings.shippingConditions.push(sc);
    }
    else {
      var scIndex = this.countrySettings.shippingConditions
        .findIndex(x => x.shippingConditionId == shippingCond.shippingConditionId);

      if (scIndex > -1) {
        this.countrySettings.shippingConditions.splice(scIndex, 1);
      }
    }
  }

  // ============================================================================================================
  // Delivery

  processCommitment(shipCondId: number, prodTypeId: number, type: DeliveryWindow) {
    switch (type.deliveryWindowCode) {
      case 'D':
        this.changeCommitment(shipCondId, prodTypeId, type)
        break;
      case 'H':
        this.changeCommitment(shipCondId, prodTypeId, type)
        break;
      case 'W':
        this.openWindowDialog(shipCondId, prodTypeId)
        break;
      case 'Y':
        this.openDynamicWindowDialog(shipCondId, prodTypeId)
        break;
      default:
        break;
    }
  }

  displayWindowOption(shipCondId: number, prodTypeId: number): string {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == shipCondId && x.productTypeId == prodTypeId);

    if (!commitment) {
      return "";
    }

    var ret = this.deliveryWindows.deliveryWindows
      .find(x => {
        if (commitment.deliveryTimeCommitmentType) {
          return x.deliveryWindowId == commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeId;
        }
        else {
          return false;
        }
      });

    return ret ? ret.deliveryWindowDesc : "";
  }

  changeCommitment(shipCondId: number, prodTypeId: number, type: DeliveryWindow) {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == shipCondId && x.productTypeId == prodTypeId);

    if (commitment != null) {
      commitment.dynamicWindowHorizon = 1;
      commitment.windows = [];
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeId = type.deliveryWindowId;
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeCode = type.deliveryWindowCode;
    }
    else {
      let nc: DeliveryTimeCommitment = {
        shippingConditionId: shipCondId,
        productTypeId: prodTypeId,
        deliveryTimeCommitmentType: {
          deliveryTimeCommitmentTypeId: type.deliveryWindowId,
          deliveryTimeCommitmentTypeCode: type.deliveryWindowCode
        },
        windows: [],
        dynamicWindowHorizon: 1
      }

      this.countrySettings.deliveryTimeCommitments.push(nc);
    }
  }

  openNewWindow() {
    this._startAtDirty = false;
    this._endAtDirty = false;
    this.newWindowDialog.open();
    this.canSaveDeliveryTimeCommitmentWindows = true;
  }

  private closeNewWindowDialog() {
    this.newWindowDialog.close();
  }

  newWindowOk(){
    if(this.tempwindow != null){
      this.updateWindow(this._startAt, this._endAt);
    }else{
      this.addShift(this._startAt, this._endAt);
    }
  }

  openWindowDialog(shipCondId: number, prodTypeId: number) {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == shipCondId && x.productTypeId == prodTypeId);

    if (commitment != null) {
      this.windows = commitment.windows;
    }

    this.currentWindowShippingConditionId = shipCondId;
    this.currentWindowMaterialTypeId = prodTypeId;
    this.windowDialog.open();
  }

  private closeWindowDialog() {
    this.windows = [{
      windowNumber: 1,
      startAt: "00:00",
      endAt: "00:59",
      duration: 0
    }];
    this.currentWindowShippingConditionId = 0;
    this.currentWindowMaterialTypeId = 0;
    this.windowDialog.close();
  }

  windowOk() {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == this.currentWindowShippingConditionId && x.productTypeId == this.currentWindowMaterialTypeId);

    var type = this.deliveryWindows.deliveryWindows
      .find(x => x.deliveryWindowCode == 'W');

    if (commitment != null) {
      commitment.dynamicWindowHorizon = 1;
      commitment.windows = this.windows;
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeId = type.deliveryWindowId;
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeCode = type.deliveryWindowCode
    }
    else {
      let nc: DeliveryTimeCommitment = {
        shippingConditionId: this.currentWindowShippingConditionId,
        productTypeId: this.currentWindowMaterialTypeId,
        deliveryTimeCommitmentType: {
          deliveryTimeCommitmentTypeId: type.deliveryWindowId,
          deliveryTimeCommitmentTypeCode: type.deliveryWindowCode
        },
        windows: this.windows,
        dynamicWindowHorizon: 1
      }

      this.countrySettings.deliveryTimeCommitments.push(nc);
    }

    this.windows = [{
      windowNumber: 1,
      startAt: "00:00",
      endAt: "00:59",
      duration: 0
    }];
    this.currentWindowShippingConditionId = 0;
    this.currentWindowMaterialTypeId = 0;
    this.windowDialog.close();
  }

  getDuration(start: string, end: string): number {
    let s = parseInt(start.substr(0, 2));
    let e = parseInt(end.substr(0, 2)) + 1;
    if (s > e) {
      return (e + 24) - s;
    } // end if e > s
    return e - s;
  }

  getTotalDuration(): number {
    let total = 0;
    this.windows.forEach(w => {
      let s = parseInt(w.startAt.substr(0, 2));
      let e = parseInt(w.endAt.substr(0, 2)) + 1;

      if (s > e) {
        w.duration = (e + 24) - s;
      } else {
        w.duration = e - s;
      } // end if e > s
      total += w.duration;
    });

    return total;
  }

  // addShift() {
  //   let shift: IWindow = {
  //     windowNumber: this.windows.length + 1,
  //     startAt: "00:00",
  //     endAt: "00:59",
  //     duration: 0
  //   };

  //   this.windows.push(shift);
  //   this.canSaveDeliveryTimeCommitmentWindows = true;
  // }

  addShift(startAt: string, endAt: string) {
    let windowNumber: number = 1;

    if (this.windows.length > 0) {
      windowNumber = this.windows[this.windows.length-1].windowNumber + 1;
    } // end if windows len > 0

    let duration = this.getDuration(startAt, endAt);
    let shift: IWindow = {
      windowNumber,
      startAt,
      endAt,
      duration
    };
    this._endAt="00:59";
    this._startAt="00:00";
    this.closeNewWindowDialog();
    this.windows.push(shift);
  }

  updateWindow(start:string, end:string) {
    let dur = this.getDuration(this._startAt, this._endAt);


    this.tempwindow.startAt = start;
    this.tempwindow.endAt = end;
    this.tempwindow.duration = dur;
    let index = this.windows.findIndex(x => x.windowNumber == this.tempwindow.windowNumber);
    this.windows[index] = this.tempwindow;
    this._endAt="00:59";
    this._startAt="00:00";
    this.tempwindow = null;
    this.closeNewWindowDialog();
  }

  deleteShift(row: IWindow) {
    var index = this.windows
      .findIndex(x => x.windowNumber == row.windowNumber);

    this.windows.splice(index, 1);
    this.canSaveDeliveryTimeCommitmentWindows = (this.windows.length > 0);
  }

  editShift(row: IWindow) {
    this.tempwindow = row;
    this._startAt = this.tempwindow.startAt;
    this._endAt = this.tempwindow.endAt;
    this.openNewWindow();
  }

  openDynamicWindowDialog(shipCondId: number, prodTypeId: number) {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == shipCondId && x.productTypeId == prodTypeId);

    if (commitment != null) {
      this.dynamicWindowHorizon = (commitment.dynamicWindowHorizon == 0 ? 1 : commitment.dynamicWindowHorizon);
    }

    this.currentDynamicWindowShippingConditionId = shipCondId;
    this.currentDynamicWindowMaterialTypeId = prodTypeId;
    this.dynamicWindowDialog.open();
  }

  private closeDynamicWindowDialog() {
    this.dynamicWindowHorizon = 1;
    this.currentDynamicWindowShippingConditionId = 0;
    this.currentDynamicWindowMaterialTypeId = 0;
    this.dynamicWindowDialog.close();
  }

  dynamicWindowOk() {
    var commitment = this.countrySettings.deliveryTimeCommitments
      .find(x => x.shippingConditionId == this.currentDynamicWindowShippingConditionId && x.productTypeId == this.currentDynamicWindowMaterialTypeId);

    var type = this.deliveryWindows.deliveryWindows
      .find(x => x.deliveryWindowCode == 'Y');

    if (commitment != null) {
      commitment.dynamicWindowHorizon = this.dynamicWindowHorizon;
      commitment.windows = [];
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeId = type.deliveryWindowId;
      commitment.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeCode = type.deliveryWindowCode
    }
    else {
      let nc: DeliveryTimeCommitment = {
        shippingConditionId: this.currentDynamicWindowShippingConditionId,
        productTypeId: this.currentDynamicWindowMaterialTypeId,
        deliveryTimeCommitmentType: {
          deliveryTimeCommitmentTypeId: type.deliveryWindowId,
          deliveryTimeCommitmentTypeCode: type.deliveryWindowCode
        },
        windows: [],
        dynamicWindowHorizon: this.dynamicWindowHorizon
      }

      this.countrySettings.deliveryTimeCommitments.push(nc);
    }

    this.dynamicWindowHorizon = 1;
    this.currentDynamicWindowShippingConditionId = 0;
    this.currentDynamicWindowMaterialTypeId = 0;
    this.dynamicWindowDialog.close();
  }

  // ============================================================================================================
  // Calendar

  checkCalendar(day: number): boolean {
    if (this.countrySettings.calendar) {
      let binary: number[] = new Array(7);

      let n = this.countrySettings.calendar.workingDays;
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

      return binary[day - 1] == 1;
    }

    return true;
  }

  updateCalendar(day: number) {
    if (this.countrySettings.calendar) {
      let binary: number[] = new Array(7);

      let n = this.countrySettings.calendar.workingDays;
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
      binary[day - 1] = replaceValue;

      let workingDays = 0;
      value = 64;
      for (let i = 0; i < binary.length; i++) {
        workingDays += binary[i] * value;
        value /= 2;
      }

      this.countrySettings.calendar.workingDays = workingDays;
      this.updateWeekWorkingDays();
    }
  }

  getFormattedDate(date: string): string {
    let numbers = date.split('-');
    return this.monthDays[parseInt(numbers[1]) - 1] + ' ' + numbers[2];
  }

  deleteDate(date: string) {
    var index = this.countrySettings.calendar.nonWorkingDays
      .findIndex(x => x == date);

    this.countrySettings.calendar.nonWorkingDays.splice(index, 1);
    this.nonWorkingDates = [];
    this.nonWorkingDates = this.countrySettings.calendar.nonWorkingDays.map(nwd => new Date(nwd));
  } // end deleteDate function

  addNonWorkingDay() {

    this.nonWorkingDates = [];

    this.countrySettings.calendar.nonWorkingDays.forEach(nwd => {
      let numbers = nwd.split('-');

      if (Number(numbers[0]) != this.currentYear) {
        nwd = this.currentYear + '-' + numbers[1] + '-' + numbers[2];
      }

      let date = new Date();
      date.setDate(Number(numbers[2]));
      date.setMonth(Number(numbers[1]) - 1);
      this.nonWorkingDates.push(date);
    });


    this.nonWorkingDaysDialog.open();
  }

  private closeNonWorkingDay() {
    this.countrySettings.calendar.nonWorkingDays = [];

    if (this.nonWorkingDates) {
      this.nonWorkingDates.forEach(nwd => {
        let fixedDate = nwd.getFullYear() + '-' + (nwd.getMonth() + 1) + '-' + nwd.getDate();
        this.countrySettings.calendar.nonWorkingDays.push(fixedDate);
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

    this.countrySettings.compensationTimes
      .find(x => x.geolocationService.geolocationServiceId == geo.geolocationServiceId).calculationTypeId = type;
  }

  changeCompensationTime(geo: GeolocationService) {
    this.countrySettings.compensationTimes
      .find(x => x.geolocationService.geolocationServiceId == geo.geolocationServiceId).compensationTime = geo.compensationTime;
  }

  // ============================================================================================================
  // Reaction and Loading Time

  addReactionTime(shippingConditionId: number, materialTypeId: number, event: any) {
    let rt = this.countrySettings.reactionTimes
      .find(x => x.productTypeId == materialTypeId && x.shippingConditionId == shippingConditionId);

    if (rt) {
      rt.reactionTime = event.srcElement.value;
    } else {
      rt = {
        shippingConditionId: shippingConditionId,
        productTypeId: materialTypeId,
        reactionTime: Number(event.srcElement.value)
      };

      this.countrySettings.reactionTimes.push(rt);
    }
  }

  getReactionTime(shippingConditionId: number, materialTypeId: number): number {
    let reaction = 0;

    this.countrySettings.reactionTimes.forEach(rt => {
      if (rt.shippingConditionId == shippingConditionId && rt.productTypeId == materialTypeId) {
        reaction = rt.reactionTime;
        return;
      }
    });

    return reaction;
  }

  addLoadingTime(shippingTypeId: number, materialTypeId: number, event: any) {
    let lt = this.countrySettings.loadingTimes
      .find(x => x.productTypeId == materialTypeId && x.shippingTypeId == shippingTypeId);

    if (lt) {
      lt.loadingTime = event.srcElement.value;
    } else {
      lt = {
        shippingTypeId: shippingTypeId,
        productTypeId: materialTypeId,
        loadingTime: Number(event.srcElement.value)
      };

      this.countrySettings.loadingTimes.push(lt);
    }
  }

  getLoadingTime(shippingTypeId: number, materialTypeId: number): number {
    let loading = 0;

    this.countrySettings.loadingTimes.forEach(lt => {
      if (lt.shippingTypeId == shippingTypeId && lt.productTypeId == materialTypeId) {
        loading = lt.loadingTime;
        return;
      }
    });

    return loading;
  }

  // ============================================================================================================
  // reservation times

  updateReservationTime($event, applicationClientId: number) {
    var resTime = this.countrySettings.reservationTimes
      .find(x => x.applicationClient.applicationClientId == applicationClientId);

    resTime.reservationTime = Number($event.target.value);
  }

  // ============================================================================================================
  // Validity

  checkValidity(value: number, min: number, max: number, key?: string): boolean {
    this.canSave = (value <= max && value >= min);

    switch (key) {
      case 'dynamicWindowHorizon':
        this.canSaveDynamicWindowHorizon = this.canSave;
        break;
    } // end switch

    return !this.canSave;
  }

  checkValidityReservationTime(applicationClientId: number, min: number, max: number) {
    if (this.countrySettings.reservationTimes) {

      let value = this.countrySettings.reservationTimes
        .find(x => {
          if (x.applicationClient) {
            return x.applicationClient.applicationClientId == applicationClientId;
          }
          else {
            return false;
          }
        });

      if (value) {
        return this.checkValidity(value.reservationTime, min, max);
      } else {
        return false;
      }

    }
  }

  checkValidityReaction(shippingConditionId: number, materialTypeId: number, min: number, max: number): boolean {
    let value = 120;

    this.countrySettings.reactionTimes.forEach(rt => {
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

    this.countrySettings.loadingTimes.forEach(rt => {
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
   * @param settings ICountrySettings the settings to validate
   *
   * @return boolean
   */
  validateSettings(settings: ICountrySettings): boolean {

    let warningMessage: string = "";

    if (!settings || !settings.hasOwnProperty("countryCode")) {
      return false;
    } // end if no settings

    try {

      if (settings.hasOwnProperty('counterOfferNumber')) {
        if (
          !(settings.counterOfferNumber <= 5 && settings.counterOfferNumber >= 1)
          || !Number.isInteger(settings.counterOfferNumber)
        ) {
          warningMessage = this.translate('digital_confirmation.errors.invalid_counter_offer_quantity');
          throw new Error(warningMessage);
        }

        if (
          !(settings.counterOfferHorizon <= 144 && settings.counterOfferHorizon >= 24)
          || !Number.isInteger(settings.counterOfferHorizon)
        ) {
          warningMessage = this.translate('digital_confirmation.errors.invalid_counter_offer_horizon');
          throw new Error(warningMessage);
        }

        if (
          !(settings.multiOfferQuantity <= 5 && settings.multiOfferQuantity >= 1)
          || !Number.isInteger(settings.multiOfferQuantity)
        ) {
          warningMessage = this.translate('digital_confirmation.errors.invalid_multi_offer_quantity');
          throw new Error(warningMessage);
        }

        if (
          !(settings.multiOfferHorizon <= 720 && settings.multiOfferHorizon >= 24)
          || !Number.isInteger(settings.multiOfferHorizon)
        ) {
          warningMessage = this.translate('digital_confirmation.errors.invalid_multi_offer_horizon');
          throw new Error(warningMessage);
        }

        if (settings.deliveryTimeCommitments) {
          settings.deliveryTimeCommitments.forEach(dtc => {
            if (dtc.deliveryTimeCommitmentType) {
              if (!this.hasValidDeliveryWindowId(dtc.deliveryTimeCommitmentType.deliveryTimeCommitmentTypeId)) {
                warningMessage = this.translate('digital_confirmation.errors.invalid_delivery_time_commitment');
                throw new Error(warningMessage);
              }
            }
          });

          let requiredDTC = settings.shippingConditions.length * settings.productTypes.length;
          if (settings.deliveryTimeCommitments.length < requiredDTC) {
            warningMessage = this.translate('digital_confirmation.errors.invalid_delivery_time_commitment');
            throw new Error(warningMessage);
          }
        }

        if (settings.reservationTimes) {
          settings.reservationTimes.map(rt => rt.reservationTime = Number(rt.reservationTime));
          settings.reservationTimes.forEach(rt => {
            if (!(rt.reservationTime <= 60 && rt.reservationTime >= 1) || !Number.isInteger(rt.reservationTime)) {
              warningMessage = this.translate('digital_confirmation.errors.invalid_reservation_time');
              throw new Error(warningMessage);
            }
          });
        } // end if settings reservation time
      } // end if has own property counter offer number

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
        settings.compensationTimes.map(rt => { rt.compensationTime = Number(rt.compensationTime); });
        settings.compensationTimes.forEach(ct => {
          var max = ct.calculationTypeId == 1 ? 2160 : 500;

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

  hasValidDeliveryWindowId(id: number) {
    let ret = false;

    this.deliveryWindows.deliveryWindows.forEach(dw => {
      if (id == dw.deliveryWindowId) {
        ret = true;
        return;
      }
    });

    return ret;
  }

  /**
   * Validates the values that user types on Number Field Form
   */
  checkUserInput(e) {
    //Permited values on the inputs numbers 0 - 9, position arrows up, down, left, right and backspace key.
    let ascii = [8, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    return (ascii.find(x => x == e.keyCode) != undefined) && e.keycode != 186; //186 ascii code is for ´´ key that have a bug for inputs.
  }

  /**
   * Validates and saves the settings
   *
   * @return void
   */
  onSave(): void {
    try {
      if (!this.validateSettings(this.countrySettings)) {
        return;
      } // end if not validateSettings

      this.api.updateCountrySettings(this.countrySettings).subscribe(
        response => {
          if (response === true) {
            this.showBarMessage(this.translate('digital_confirmation.settings.messages.updated_country_settings'), 'info');
          } else {
            this.showBarMessage(this.translate('digital_confirmation.settings.errors.not_updated_country_settings'), 'error');
          }
        },
        error => {
          this.showBarMessage(this.translate('digital_confirmation.settings.errors.not_updated_country_settings'), 'error');
        }
      );
    }
    catch (ex) {
      console.error(ex);
    }
  }

  private setStartAt(op: string) {
    this._startAt = op;
    this._startAtDirty = true;
  } // end function setStartAt

  private setEndAt(op: string) {
    this._endAt = op;
    this._endAtDirty = true;
  } // end function setStartAt
}// end country settings