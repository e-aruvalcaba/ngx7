import { Component } from '@angular/core';
import { IStagingData } from './models/staging-data.interface'//'../ models/staging-data.interface';
import { STAGING_DATA, STAGING_TYPES, STAGING_TYPES2 } from '../app/data/staging-data';

@Component({
  selector: 'app-staging',
  templateUrl: './staging.component.html',
  styleUrls: ['./staging.component.scss']
})
export class StagingComponent {

  private stagingData: IStagingData[];
  private TYPES = STAGING_TYPES;
  private TYPES2 = STAGING_TYPES2;
  private TYPESDATA : any[] = STAGING_TYPES;

  constructor() {
    this.stagingData = STAGING_DATA;
  } // end constructor

  /**
   * Handles change data
   */
  private changeHandler(data: any): void {
    console.log("changeHandler", data);
    console.log("types", this.TYPESDATA);
    this.TYPESDATA = STAGING_TYPES2;
    console.log("types", this.TYPESDATA);
  } // end function changeHandler

  /**
   * Handles change data
   */
  private addHandler(data: any): void {
    console.log("addHandler", data);
    alert("Added");
    location.reload();
  } // end function changeHandler

  /**
   * Handles change data
   */
  private editHandler(data: any): void {
    console.log("editHandler", data);
  } // end function changeHandler

  /**
   * Handles change data
   */
  private deleteHandler(data: any): void {
    console.log("deleteHandler", data);
  } // end function changeHandler

} // end class StagingComponent