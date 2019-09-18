import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-localization-v7'; //updated from v1
import { CnxGblOrgService } from '../../../services/cnx-gbl-org.service';
import { ORDER_FULFILLMENT_APP_MENUES } from '../../../data/order-fulfillment-app-menues';
import { RCCC_APP_MENUES } from '../../../data/rccc-app-menues';
import { IAppMenu } from '../../../models/app-menu.interface';

import { FleetCoverage } from '../../../models/fleet-coverage';
import { AlertService } from '@cemex/cmx-alert-v7'; //updated from v2
import { CmxDialogComponent } from '@cemex/cmx-dialog-v7'; //updated from v4

const TYPE_CODE_LEN = 20;
const TYPE_DESC_LEN = 30;

@Component({
  selector: 'fleet-coverage',
  templateUrl: './fleet-coverage.component.html',
  styleUrls: ['./fleet-coverage.component.scss']
})
export class FleetCoverageComponent implements OnInit {
  fleetCoverages: FleetCoverage[];
  selectedFleetCoverage: FleetCoverage;
  hasFleetCoverageItems: boolean;

  // Message dialog message
  private messageText: string;

  @ViewChild('deleteFleetCoverage') private deleteFleetCoverage : CmxDialogComponent;

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

  private OnSaveFleetCoverages(value: FleetCoverage[]): void {
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
    this.api.InsertFleetCoverage(value)
    .subscribe(x => {
      this.loadDisplayData(x);
      let message = '';
      if(value.length === 1) {
        message = this.translate('rccc.catalogs.fleet_coverage.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_coverage.save_multiple_confirm_message');
      }

      this.alertService.openSuccess(message, '', 5000);
      this.api.stopWaiting();
    }, error => {
      this.api.stopWaiting();
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, value);
      } else if(error.code === 53000) {
        this.alertService.openError(this.translate('rccc.errors.generic_message'), '', 5000);
      } else {
        this.alertService.openError(this.translate('rccc.errors.generic_message'), '', 5000);
      }
    });
  }

  private OnDeleteFleetCoverage(fleetCoverage: FleetCoverage[]): void {
    this.selectedFleetCoverage = fleetCoverage[0];
    var message = `${this.translate('rccc.catalogs.fleet_coverage.delete_message')}: ${this.selectedFleetCoverage.fleetCoverageCode}?`;

    this.showMessage(message);
  }

  private OnChangeFleetCoverage(fleetCoverage: FleetCoverage[]): void {
    const repeated = this.ValidateRepeatedInNonSavedFleetTypes(fleetCoverage);
    if(repeated.length > 0) {
      this.HandleRepeatedNotSavedItemsError(repeated);
      return;
    }

    const validateFields = this.ValidateFields(fleetCoverage);
    if(!validateFields){
      return;
    }

    this.api.await();
    this.api.UpdateFleetCoverage(fleetCoverage)
    .subscribe(x => {
      this.api.stopWaiting();
      this.loadDisplayData(x);
      let message = '';
      if(fleetCoverage.length === 1) {
        message = this.translate('rccc.catalogs.fleet_coverage.save_single_confirm_message');
      } else {
        message = this.translate('rccc.catalogs.fleet_coverage.save_multiple_confirm_message');
      }

      this.alertService.openSuccess(message, '', 5000);
    }, error => {
      if(error.code == 53001){
        this.HandleRepeatedItemsError(error, fleetCoverage);
      } else if(error.code === 53000) {
        this.alertService.openError(this.translate('rccc.catalogs.error_load_information'), '', 5000);
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
      this.api.GetFleetCoverage()
      .subscribe(x => {
        this.hasFleetCoverageItems = x.length > 0;
        this.fleetCoverages = x;
        this.api.stopWaiting();
      }, error => {
        this.alertService.openError(error, '', 5000);
        this.api.stopWaiting();
      })
    }
  }

  private HandleRepeatedItemsError(error: any, value: FleetCoverage[]) {
    let data: number[] = JSON.parse(error['data']);
    let message = this.translate('rccc.catalogs.fleet_coverage.duplicate_items_message');
    data.forEach(element => {
      const e: FleetCoverage = value[element - 1];
      if(e !== undefined) {
        message += ` ${e.fleetCoverageCode},`;
      }
    });
    if (message.endsWith(',')) {
      message = message.slice(0, -1);
    }
    this.alertService.openError(message, '', 5000);
  }

  private HandleRepeatedNotSavedItemsError(fleetCoverage: FleetCoverage[]): void {
    let message = this.translate('rccc.catalogs.fleet_coverage.duplicate_items_message');
    fleetCoverage.forEach(element => {
      if(element !== undefined) {
        message += ` ${element.fleetCoverageCode},`;
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
  private ValidateRepeatedInNonSavedFleetTypes(fleetCoverage: FleetCoverage[]): FleetCoverage[] {
    if(fleetCoverage !== undefined || fleetCoverage.length > 1) {
      let set = new Set<string>();
      let repeated = new Array<FleetCoverage>();

      fleetCoverage.forEach((value, index, array) => {
        if(set.size === 0) {
          set.add(value.fleetCoverageCode);
        } else {
          if(!set.has(value.fleetCoverageCode)) {
            set.add(value.fleetCoverageCode);
          } else {
            repeated.push(value);
          }
        }
      });
      return repeated;
    }
    return [];
  }

  private ValidateFields(fleetCoverage: FleetCoverage[]): boolean {
    for (let index = 0; index < fleetCoverage.length; index++) {
      const element = fleetCoverage[index];
      if(!this.ValidateFieldsLength(element)) {
        return false;
      }
    }

    return true;
  }

  private ValidateFieldsLength(fleetCoverage: FleetCoverage): boolean {
    if((fleetCoverage.fleetCoverageCode) && fleetCoverage.fleetCoverageCode.length > TYPE_CODE_LEN) {
      this.alertService.openError( `${this.translate('rccc.catalogs.fleet_coverage.type_code_length')} ${TYPE_CODE_LEN} ${this.translate('rccc.catalogs.fleet_coverage.characters')}`, '', 5000);
      return false;
    }

    if(fleetCoverage.fleetCoverageDesc.length > TYPE_DESC_LEN) {
      this.alertService.openError( `${this.translate('rccc.catalogs.fleet_coverage.type_code_length')} ${TYPE_CODE_LEN} ${this.translate('rccc.catalogs.fleet_coverage.characters')}`, '', 5000);
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
    this.deleteFleetCoverage.open();
    window.scrollTo(0,0);
  } // end function showMessage

  OnDeleteDialogConfirm(): void {
    this.api.await();
    this.api.DeleteFleetCoverage(this.selectedFleetCoverage)
    .subscribe(x => {
      this.loadDisplayData(x);
      const message = `${ this.translate('rccc.catalogs.fleet_coverage.delete_confirm_message')} ${this.selectedFleetCoverage.fleetCoverageCode} ${ this.translate('rccc.catalogs.fleet_coverage.delete_confirm_message_cont') }`;
      this.alertService.openSuccess(message, '', 5000);
      this.api.stopWaiting();
      this.OnDeleteDialogCancel();
    }, error => {
      this.alertService.openError(error, '', 5000);
      this.api.stopWaiting();
      this.OnDeleteDialogCancel();
    });

  }

  OnDeleteDialogCancel(): void {
    this.selectedFleetCoverage = null;
    this.deleteFleetCoverage.close();
  }

  private OnCancel(cancel: boolean): void {
    if (cancel) {
      this.loadDisplayData(true);
    } // end if cancel
  } // end OnCancel
} // end class FleetCoverageComponent