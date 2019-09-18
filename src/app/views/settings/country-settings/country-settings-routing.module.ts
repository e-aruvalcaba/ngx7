import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountrySettingsComponent } from './country-settings.component';

const routes: Routes = [
  {
    path: '', component: CountrySettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountrySettingsRoutingModule { }
