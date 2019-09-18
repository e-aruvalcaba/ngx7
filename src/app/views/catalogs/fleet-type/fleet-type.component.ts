import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-localization-v7'; //updated from v1
import { CnxGblOrgService } from '../../../services/cnx-gbl-org.service';
import { ORDER_FULFILLMENT_APP_MENUES } from '../../../data/order-fulfillment-app-menues';
import { RCCC_APP_MENUES } from '../../../data/rccc-app-menues';
import { IAppMenu } from '../../../models/app-menu.interface';

import { FleetType } from '../../../models/fleet-type';
import { AlertService } from '@cemex/cmx-alert-v7'; //updated from v2
import { AlertType } from '@cemex/cmx-alert-v7/cemex-cmx-alert-v7'; //updated from v2
import { forEach } from '@angular/router/src/utils/collection';
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; // updated from v4

const TYPE_CODE_LEN = 12;
const TYPE_DESC_LEN = 25;
const TYPE_COMMENT_LEN = 30;

/**
 * FleetTypeComponent
 */
@Component({
  selector: 'app-fleet-type',
  templateUrl: './fleet-type.component.html',
  styleUrls: ['./fleet-type.component.scss']
})
export class FleetTypeComponent implements OnInit {
  fleetTypes: FleetType[];
  selectedFleetType: FleetType;
  hasFleetItems: boolean;

  // Message dialog message
  private messageText: string;

  @ViewChild('deleteFleetType') private deleteFleetType : CmxDialogComponent;

  ngOnInit(): void {
    this.loadDisplayData(true);
  }

  constructor(
    private api: CnxGblOrgService,
    private ts: TranslationService,
    private router: Router,
    private alertService: AlertService
  ) {
  } // end constructor

  private OnSaveFleetType(value: FleetType[]): void {
    const repeated = this.ValidateRepeatedInNonSavedFleetTypes(value);
    if(repeated.length > 0) {
      this.HandleRepeatedNotSavedItemsError(repeated);
      return;
    }

    const validateFields = this.ValidateFields(value);
    if(!validateFields){
      return;
    }


    this.api.await();
    this.api.InsertFleetType(value)
    .subscribe(x => {
      this.api.stopWaiting();
      this.loadDisplayData(x);
      let message = '';
      if(value.length === 1) {
        message = this.translate('rccc.catalogs.fleet_type.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_type.save_multiple_confirm_message');
      }

      this.alertService.openSuccess(message, '', 5000);
    }, error => {
      this.api.stopWaiting();
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, value);
      } else if(error.code === 53000) {
        this.alertService.openError(this.translate('rccc.catalogs.error_load_information'), '', 5000);
      }
    });
  }

  private OnDeleteFleetType(fleetType: FleetType[]): void {
    this.selectedFleetType = fleetType[0];
    const message = `${this.translate('rccc.catalogs.fleet_type.delete_message')}: ${this.selectedFleetType.fleetTypeCode}?`;

    this.showMessage(message);
  }

  private OnChangeFleetType(fleetType: FleetType[]): void {
    const repeated = this.ValidateRepeatedInNonSavedFleetTypes(fleetType);
    if(repeated.length > 0) {
      this.HandleRepeatedNotSavedItemsError(repeated);
      return;
    }

    const validateFields = this.ValidateFields(fleetType);
    if(!validateFields){
      return;
    }

    this.api.await();
    this.api.UpdateFleetType(fleetType)
    .subscribe(x => {
      this.api.stopWaiting();
      this.loadDisplayData(x);
      let message = '';
      if(fleetType.length === 1) {
        message = this.translate('rccc.catalogs.fleet_type.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_type.save_multiple_confirm_message');
      }

      this.alertService.openSuccess(message, '', 5000);
    }, error => {
      this.api.stopWaiting();
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, fleetType);
      } else if(error.code === 53000) {
        this.alertService.openError('Error al actualizar información', '', 5000);
      }
    });
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

  private loadDisplayData(response: boolean): void {
    if(response)
    {
      this.api.await();
      this.api.GetFleetType()
      .subscribe(x => {
        this.hasFleetItems = x.length > 0;
        this.fleetTypes = x;
        this.api.stopWaiting();
      }, error => {
        this.alertService.openError(error, '', 5000);
      });
    }
  }

  private HandleRepeatedItemsError(error: any, value: FleetType[]) {
    let data: number[] = JSON.parse(error['data']);
    let message = this.translate('rccc.catalogs.fleet_type.duplicate_items_message');
    data.forEach(element => {
      const e: FleetType = value[element - 1];
      if(e !== undefined) {
        message += ` ${e.fleetTypeCode},`;
      }
    });
    if (message.endsWith(',')) {
      message = message.slice(0, -1);
    }
    this.alertService.openError(message, '', 5000);
  }

  private HandleRepeatedNotSavedItemsError(fleetTypes: FleetType[]): void {
    let message = this.translate('rccc.catalogs.fleet_type.duplicate_items_message');
    fleetTypes.forEach(element => {
      if(element !== undefined) {
        message += ` ${element.fleetTypeCode},`;
      }
    });
    if (message.endsWith(',')) {
      message = message.slice(0, -1);
    }
    this.alertService.openError(message, '', 5000);
  }

  /**
   * Return repeated elements on an Array.
   * @param fleetTypes
   */
  private ValidateRepeatedInNonSavedFleetTypes(fleetTypes: FleetType[]): FleetType[] {
    if(fleetTypes !== undefined || fleetTypes.length > 1) {
      let set = new Set<string>();
      let repeated = new Array<FleetType>();

      fleetTypes.forEach((value, index, array) => {
        if(set.size === 0) {
          set.add(value.fleetTypeCode);
        } else {
          if(!set.has(value.fleetTypeCode)) {
            set.add(value.fleetTypeCode);
          } else {
            repeated.push(value);
          }
        }
      });
      return repeated;
    }
    return [];
  }

  private ValidateFields(fleetTypes: FleetType[]): boolean {
    for (let index = 0; index < fleetTypes.length; index++) {
      const element = fleetTypes[index];
      if(!this.ValidateFieldsLength(element)) {
        return false;
      }
    }

    return true;
  }

  private ValidateFieldsLength(fleetType: FleetType): boolean {
    if(fleetType.fleetTypeCode.length > TYPE_CODE_LEN) {
      this.alertService.openError( `${this.translate('rccc.catalogs.fleet_type.type_code_length')} ${TYPE_CODE_LEN} ${this.translate('rccc.catalogs.fleet_type.characters')}`, '', 5000);
      return false;
    }

    if(fleetType.fleetTypeDesc.length > TYPE_DESC_LEN) {
      this.alertService.openError(  `${this.translate('rccc.catalogs.fleet_type.type_desc_length')} ${TYPE_DESC_LEN} ${this.translate('rccc.catalogs.fleet_type.characters')}`, '', 5000);
      return false;
    }

    if(fleetType.comments.length > TYPE_COMMENT_LEN) {
      this.alertService.openError( `${this.translate('rccc.catalogs.fleet_type.type_comments_length')} ${TYPE_COMMENT_LEN} ${this.translate('rccc.catalogs.fleet_type.characters')}`, '', 5000);
      return false;
    }

    return true;
  }

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
    this.api.DeleteFleetType(this.selectedFleetType)
    .subscribe(x => {
      this.api.stopWaiting();
      const message = `${ this.translate('rccc.catalogs.fleet_type.delete_confirm_message')} ${this.selectedFleetType.fleetTypeCode} ${ this.translate('rccc.catalogs.fleet_type.delete_confirm_message_cont') }`;
      this.alertService.openSuccess(message, '', 5000);
      this.loadDisplayData(x);
      this.OnDeleteDialogCancel();
    }, error => {
      console.error(error);
      this.api.stopWaiting();
      let errorMessage = this.translate('digital_confirmation.fleet_type_bu.errors.insert_fleet_type_by_bu');
      // let errorMessage = this.translate('rccc.errors.generic_message');
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
            console.error(errorMessage);
          } // end if try
        } // end if has own property moreInformation
      } // end if has error
      this.alertService.openError(errorMessage, '', 5000);
      this.OnDeleteDialogCancel();
    });
  }

  OnDeleteDialogCancel(): void {
    this.selectedFleetType = null;
    this.deleteFleetType.close();
  }

  private OnCancel(cancel: boolean): void {
    if (cancel) {
      this.loadDisplayData(true);
    } // end if cancel
  } // end OnCancel

} // end class FleetTypeComponent