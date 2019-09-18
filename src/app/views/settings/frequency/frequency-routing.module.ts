import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrequencyComponent } from './frequency.component';

const routes: Routes = [{
  path: '', component: FrequencyComponent
}];

//This componen isn't added to the sharedconfig routing 'cause isn't in use, if wants to work with it please add to the config for lazyloading.


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrequencyRoutingModule { }
