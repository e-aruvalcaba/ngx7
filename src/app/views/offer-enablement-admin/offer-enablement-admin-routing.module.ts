import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferEnablementAdminComponent } from './offer-enablement-admin.component';

const routes: Routes = [
  {
    path: '', component: OfferEnablementAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferEnablementAdminRoutingModule { }
