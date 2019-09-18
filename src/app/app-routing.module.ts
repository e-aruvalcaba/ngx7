import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StagingComponent } from './pages/staging/staging.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [StagingComponent]
})
export class AppRoutingModule {}
