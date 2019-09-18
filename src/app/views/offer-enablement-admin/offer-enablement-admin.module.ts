import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferEnablementAdminRoutingModule } from './offer-enablement-admin-routing.module';
import { OfferEnablementAdminComponent } from './offer-enablement-admin.component';

@NgModule({
  declarations: [OfferEnablementAdminComponent],
  imports: [
    CommonModule,
    OfferEnablementAdminRoutingModule
  ]
})
export class OfferEnablementAdminModule { }
