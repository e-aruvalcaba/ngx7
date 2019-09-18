import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BussinesUnitSettingsComponent } from './bussines-unit-settings.component';

const routes: Routes = [
  {
    path: '', component: BussinesUnitSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BussinesUnitSettingsRoutingModule { }
