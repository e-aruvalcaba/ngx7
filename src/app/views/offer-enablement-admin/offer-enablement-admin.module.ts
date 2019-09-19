import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { lazySharedConfig } from '../../lazyshared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCapacityTableModule } from '@cemex/cmx-capacity-table-v2';
import { CmxFixedSectionModule } from '@cemex/cmx-fixed-section-v1';
import { OfferEnablementAdminRoutingModule } from './offer-enablement-admin-routing.module';
import { OfferEnablementAdminComponent } from './offer-enablement-admin.component';
import { PlantCapacityComponent } from '../plant-capacity/plant-capacity.component';

@NgModule({
  declarations: [OfferEnablementAdminComponent],
  providers:[lazySharedConfig.providers],
  imports: [
    CommonModule,
    OfferEnablementAdminRoutingModule,
    CmxCapacityTableModule,
    CmxFixedSectionModule,
    lazySharedConfig.imports
    // FlexLayoutModule
  ],
})
export class OfferEnablementAdminModule { }
