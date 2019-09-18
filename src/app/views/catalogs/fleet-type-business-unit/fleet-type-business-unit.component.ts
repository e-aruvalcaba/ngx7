import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-localization-v7'; // updated from v1
import { CnxGblOrgService } from '../../../services/cnx-gbl-org.service';
import { ORDER_FULFILLMENT_APP_MENUES } from '../../../data/order-fulfillment-app-menues';
import { RCCC_APP_MENUES } from '../../../data/rccc-app-menues';
import { IAppMenu } from '../../../models/app-menu.interface';

import { FleetTypeBusinessUnit } from '../../../models/fleet-type-bu';
import { ProductType } from '../../../models/product-type';
import { ProductTypeGroup } from '../../../models/product-type-group';
import { Plant } from '../../../models/plant';
import { FleetType } from '../../../models/fleet-type';
import { FleetCoverage } from '../../../models/fleet-coverage';
import { AlertService } from '@cemex/cmx-alert-v7';// updated from v2
import { Product } from '../../../models/product';
import { elementAt } from 'rxjs/operator/elementAt';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7';// updated from v4

/**
 * FleetTypeBusinessUnitComponent
 */
@Component({
  selector: 'app-fleet-type-business-unit',
  templateUrl: './fleet-type-business-unit.component.html',
  styleUrls: ['./fleet-type-business-unit.component.scss']
})
export class FleetTypeBusinessUnitComponent implements OnInit {
  fleetTypesBusinessUnit: FleetTypeBusinessUnit[];
  fleetTypes: FleetType[];
  fleetCoverage: FleetCoverage[];
  plants: Plant[];
  productType: ProductType[];
  products: Product[];
  selectedFleet: FleetTypeBusinessUnit;
  hasFleetItems: boolean;
  isCoverageVisible: boolean = true;
  hasKeyChanged: boolean = false;
  /**
   * Holds the product type groups
   */
  private productTypeGroups: ProductTypeGroup[] = [];

  // Message dialog message
  private messageText: string;
  @ViewChild('deleteFleetType') private deleteFleetType : CmxDialogComponent;

  ngOnInit(): void {
    this.Setup();
  }

  constructor(
    private api: CnxGblOrgService,
    private ts: TranslationService,
    private router: Router,
    private alertService: AlertService
  ) {
  } // end constructor

  private Setup() {
    if (sessionStorage.getItem("country") != "MX") {
      this.isCoverageVisible = false;
    } // end if MX
    this.api.await();
    this.api.getMyPlants()
    .subscribe(x => {
      let plants = x.map(function(p) {
         p.plantDesc = p.plantCode + ' - ' + p.plantDesc;
         return p;
      });
      this.plants = plants;
      this.api.GetFleetType()
      .subscribe(x => {
        this.fleetTypes = x;
        this.api.GetFleetCoverage()
        .subscribe(x => {
          this.fleetCoverage = x;
          this.api.stopWaiting();
          this.api.getProductTypeGroups().subscribe(ptg => {
            this.productTypeGroups = ptg;
            console.warn("productTypeGroups", this.productTypeGroups);
            this.loadDisplayData(true);
            this.api.stopWaiting();
          }, error => {
            console.error(error);
            this.api.stopWaiting();
          }); // end api.getProductTypeGroups
        }, error => {
          console.error(error);
          this.api.stopWaiting();
        });
      }, error => {
        console.error(error);
        this.api.stopWaiting();
      });
    }, error => {
      console.error(error);
      this.api.stopWaiting();
    });
  } // end void Setup

  /**
   * Save a new or existent Fleet Type by Business Unit configuration
   */
  private OnSaveFleetTypes(fleetType: FleetTypeBusinessUnit[]): void {

    const validateFieldsWeight = this.ValidateWeights(fleetType);
    if(!validateFieldsWeight){
      return;
    }

    this.api.await();
    this.api.InsertFleetTypeByBusinessUnit(fleetType)
    .subscribe(x => {
      this.loadDisplayData(x);
      let message = '';
      if(fleetType.length === 1) {
        message = this.translate('rccc.catalogs.fleet_type_bu.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_type_bu.save_multiple_confirm_message');
      }
      this.alertService.openSuccess(message, '', 5000);
      this.api.stopWaiting();
    }, error => {
      this.api.stopWaiting();
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, fleetType);
      } else if(error.code === 53000) {
        this.alertService.openError(this.translate("digital_confirmation.fleet_type_bu.errors.updating_info"), '', 5000);
        // this.alertService.openError('Error al actualizar información', '', 5000);
      } else {
        this.alertService.openError(this.translate('digital_confirmation.fleet_type_bu.errors.insert_fleet_type_by_bu'), '', 5000);
        // this.alertService.openError(this.translate('rccc.errors.generic_message'), '', 5000);
      }
    });
  }

  /**
   * Delete a Fleet Type by Business Unit configuration
   * @param fleetType
   */
  private OnDeleteFleetType(fleetType: FleetTypeBusinessUnit[]): void {
    this.selectedFleet = fleetType[0];
    const message = this.translate('rccc.catalogs.fleet_type_bu.delete_message');

    this.showMessage(message);
  }

  /**
   * Update a Fleet Type by Business Unit configuration
   *
   * @param fleetType
   */
  private OnChangeFleetType(fleetType: FleetTypeBusinessUnit[]): void {

    if (this.hasKeyChanged) {
      this.alertService.openError(this.translate('digital_confirmation.fleet_type_bu.errors.keys_changed'), '', 5000);
      this.hasKeyChanged = false;
      return;
    } // end if has keyChanged

    const validateFieldsWeight = this.ValidateWeights(fleetType);
    if(!validateFieldsWeight){
      return;
    }

    let fleetBusinessUnit: any = {
      fleetId: fleetType[0].fleetId,
      plantId: fleetType[0].plantId,
      fleetTypeId: fleetType[0].fleetTypeId,
      productTypeGroupId: fleetType[0].productTypeGroupId,
      fleetCoverageId: fleetType[0].fleetCoverageId,
      productId: fleetType[0].productId,
      crane: fleetType[0].crane,
      moffett: fleetType[0].moffett,
      initialWeight: fleetType[0].initialWeight,
      finalWeight: fleetType[0].finalWeight
    }; // end flettBusinessUnit

    if (!fleetBusinessUnit.productTypeGroupId) {
      fleetBusinessUnit.productTypeGroupId =
        this.productTypeGroups.filter(
          g => g.productTypeGroupDesc.toUpperCase() == fleetType[0].productTypeGroupDesc.toUpperCase()
        )[0].productTypeGroupId;
    } // end if not product type group id

    this.api.await();
    this.api.UpdateFleetTypeByBusinessUnit([fleetBusinessUnit])
    .subscribe(x => {
      this.api.stopWaiting();
      this.loadDisplayData(x);
      let message = '';
      if(fleetType.length === 1) {
        message = this.translate('rccc.catalogs.fleet_type_bu.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_type_bu.save_multiple_confirm_message');
      }

      this.alertService.openSuccess(message, '', 5000);
    }, error => {
      this.api.stopWaiting();
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, fleetType);
      } else if(error.code === 53000) {
        this.alertService.openError(this.translate('rccc.catalogs.error_load_information'), '', 5000);
      }
    });
  }

  private OnCancel(cancel: boolean): void {
    if (cancel) {
      this.Setup();
    } // end if cancel
  } // end OnCancel

   /**
   * Shows a confim dialog
   *
   * @param message The message to show
   */
  showMessage(message: string) {
    this.messageText = message;
    this.deleteFleetType.open();
    window.scrollTo(0,0);
  } // end function showMessage

  OnDeleteDialogConfirm(): void {
    this.api.await();
    this.api.DeleteFleetTypeByBusinessUnit(this.selectedFleet)
    .subscribe(x => {
      this.api.stopWaiting();
      const message = `${ this.translate('rccc.catalogs.fleet_type.delete_confirm_message')} ${this.selectedFleet.fleetTypeCode} ${ this.translate('rccc.catalogs.fleet_type.delete_confirm_message_cont') }`;
      this.alertService.openSuccess(message, '', 5000);
      this.loadDisplayData(x);
      this.OnDeleteDialogCancel();
    }, error => {
      console.error(error);
      this.api.stopWaiting();
      let errorMessage = this.translate('digital_confirmation.fleet_type_bu.errors.insert_fleet_type_by_bu');
      // let errorMessage = this.translate('rccc.errors.generic_message');
          try {
            if (error.hasOwnProperty('code')) {
              if (error.code == 53002) {
                errorMessage = this.translate('rccc.errors.dependency_message');
              } // end if code is 53002
            } // end if has own property code
          } catch (ex) {
            errorMessage = ex;//this.translate('rccc.errors.generic_message');
            console.error(errorMessage);
          } // end if try
      this.alertService.openError(errorMessage, '', 5000);
      this.OnDeleteDialogCancel();
    });
  }

  OnDeleteDialogCancel(): void {
    this.selectedFleet = null;
    this.deleteFleetType.close();
  }

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

  /**
   * Perform a request to obtain the product type groups
   */
  private getMaterialTypeGroups(): void {
    this.api.getProductTypeGroups().subscribe(ptg => {
      this.api.await();
      this.productTypeGroups = ptg;
    }, error => {
      console.error(error);
      this.api.stopWaiting();
    }); // end api.getProductTypeGroups
  }; // end function getMaterialTypeGroups

  /**
   * Get the Material Types by Plant Id.
   * @param plant Selected Plant
   */
  private getMaterialTypesByPlant(plantId: number): void {
    this.api.await();
    this.api.getProductTypes(plantId).subscribe(x => {
      this.api.stopWaiting();
      this.productType = x;
    }, error => {
      this.api.stopWaiting();
    });
  }

  private getProductsByMaterialType(plantCode: string, productTypeId: number): void {
    this.api.await();
    this.api.GetProductsByPlantAndProductType(plantCode, productTypeId).subscribe(x => {
      this.api.stopWaiting();
      this.products = x;
    }, error => {
      this.api.stopWaiting();
    });
  }

  /**
   * loadDisplayData
   * @param response
   */
  private loadDisplayData(response: boolean): void {
    if(response)
    {
      this.api.await();
      this.api.GetFleetTypeByBusinessUnit()
      .subscribe(x => {
        this.api.stopWaiting();
        this.hasFleetItems = x.length > 0;
        this.fleetTypesBusinessUnit = x;
      }, error => {
        this.api.stopWaiting();
        this.alertService.openError(error, '', 5000);
      })
    }
  }

  private HandleRepeatedItemsError(error: any, value: FleetTypeBusinessUnit[]) {
    let data: number[] = JSON.parse(error['data']);
    let message = this.translate('rccc.catalogs.fleet_type.duplicate_items_message');
    data.forEach(element => {
      const e: FleetTypeBusinessUnit = value[element - 1];
      if(e !== undefined) {
        message += ` ${e.productCode},`;
      }
    });
    if (message.endsWith(',')) {
      message = message.slice(0, -1);
    }
    this.alertService.openError(message, '', 5000);
  }

  private ValidateWeights(fleetTypeBu: FleetTypeBusinessUnit[]): boolean {
    for (let index = 0; index < fleetTypeBu.length; index++) {
      const element = fleetTypeBu[index];
      if(!this.ValidateEntityWeights(element)) {
        return false;
      }
    }

    return true;
  }

  private ValidateEntityWeights(fleetTypeBU: FleetTypeBusinessUnit): boolean {
    const finalWeight: number = +fleetTypeBU.finalWeight;
    const initialWeight: number = +fleetTypeBU.initialWeight;

    if(initialWeight === 0 && finalWeight === 0) {
      this.alertService.openError(this.translate('rccc.catalogs.fleet_type_bu.initial_final_weight_zero'), '', 5000);
      return false;
    }

    if(initialWeight === 0) {
      this.alertService.openError(this.translate('rccc.catalogs.fleet_type_bu.initial_weigth_zero'), '', 5000);
      return false;
    }

    if(finalWeight === 0) {
      this.alertService.openError(this.translate('rccc.catalogs.fleet_type_bu.final_weight_zero'), '', 5000);
      return false;
    }

    if(initialWeight > finalWeight) {
      this.alertService.openError(this.translate('rccc.catalogs.fleet_type_bu.final_weight_minor_initial'), '', 5000);
      return false;
    }

    return true;
  }

  private ValidateCoverages(fleetTypeBu: FleetTypeBusinessUnit[]): boolean {
    for (let index = 0; index < fleetTypeBu.length; index++) {
      const element = fleetTypeBu[index];
      if(!this.ValidateSelectedCoverage(element)) {
        return false;
      }
    }

    return true;
  }

  private ValidateSelectedCoverage(fleettypeBu: FleetTypeBusinessUnit): boolean {
    if(fleettypeBu.fleetCoverageId === undefined || fleettypeBu.fleetCoverageCode === null ) {
      this.alertService.openError('Fleet Coverage is required.', '', 5000);
      return false;
    }

    return true;
  }

  private OnChangeComboBox(params: any): void {

    const trigger = params.trigger;
    const row = params.row[0];

    if(row !== undefined) {
      switch(trigger) {
        case 'productTypeGroupId':
          console.warn('Trigger on product type group, a key');
          this.hasKeyChanged = true;
        break;
        case 'plantId':
          console.warn('Trigger on plant, a key');
          this.hasKeyChanged = true;
        break;
        case 'fleetTypeId':
          console.warn('Trigger on fleet type, a key');
          this.hasKeyChanged = true;
        break;
      }
    }
  }
} // end class FleetTypeBusinessUnitComponent