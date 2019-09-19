import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { StartComponent } from './pages/start/start.component';
import { TestComponent } from './pages/test/test.component';
import { LoginComponent } from './pages/login/login.component';

import { CmxCoreCommonModule, AuthGuard } from '@cemex-core/angular-services-v7';
import { CmxLoginModule } from '@cemex/cmx-login-v5';
import { CmxNavHeaderModule } from '@cemex/cmx-nav-header-v7';
import { CmxSidebarModule } from '@cemex/cmx-sidebar-v7';
import { CmxButtonModule } from '@cemex/cmx-button-v4';
import { CmxDropdownModule } from '@cemex/cmx-dropdown-v4';
import { CmxCheckboxModule } from '@cemex/cmx-checkbox-v4';
import { CmxTableModule } from '@cemex/cmx-table-v7';
import { CmxDialogModule } from '@cemex/cmx-dialog-v7';
import { CmxPanelCardModule } from '@cemex/cmx-panel-card-v1/dist';
import { AlertModule, AlertService } from '@cemex/cmx-alert-v7';
import { CmxCapacityTableModule } from '@cemex/cmx-capacity-table-v2';

import { HttpModule } from '@angular/http';

import { FormatterService } from '@cemex-core/angular-localization-v7';
import { HttpClientModule } from '@angular/common/http';
import { StagingComponent } from './pages/staging/staging.component';

export const sharedConfig: NgModule = {
  providers: [FormatterService, AlertService],
  imports: [
    // BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CmxCoreCommonModule,
    CmxLoginModule,
    CmxTableModule,
    CmxDialogModule,
    CmxNavHeaderModule,
    CmxSidebarModule,
    CmxButtonModule,
    AlertModule,
    CmxCheckboxModule,
    CmxDropdownModule,
    CmxPanelCardModule,
    CmxCapacityTableModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'app', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, data: { redirectTo: 'app' } },
      { path: 'rccc/overall-capacity', redirectTo: 'app/rccc/overall-capacity', pathMatch: 'full', }, 
      { path: 'rccc/distributed-capacity', redirectTo: 'app/rccc/distributed-capacity', pathMatch: 'full', },
      { path: 'rccc/availability-inquiries', redirectTo: 'app/rccc/availability-inquiries', pathMatch: 'full', }, 
      { path: 'staging', redirectTo: 'app/staging', pathMatch: 'full', }, 
      { path: 'rccc/flco/fleet-catalog', redirectTo: 'app/rccc/flco/fleet-catalog', pathMatch: 'full' },
      { path: 'rccc/flco/fleet-coverage', redirectTo: 'app/rccc/flco/fleet-coverage', pathMatch: 'full' },
      { path: 'rccc/flco/fleet-business-unit', redirectTo: 'app/rccc/flco/fleet-business-unit', pathMatch: 'full' },
      { path: 'rccc/flco/fleet-capacity', redirectTo: 'app/rccc/flco/fleet-capacity', pathMatch: 'full' }, 
      { path: 'rccc/grco/holidays', redirectTo: 'app/rccc/grco/holidays', pathMatch: 'full' },
      { path: 'rccc/index-dashboard', redirectTo: 'app/rccc/index-dashboard', pathMatch: 'full' },
      { path: 'settings/country', redirectTo: 'app/settings/country', pathMatch: 'full' }, 
      { path: 'rccc/settings/country', redirectTo: 'app/settings/country', pathMatch: 'full' },
      { path: 'settings/business-unit', redirectTo: 'app/settings/business-unit', pathMatch: 'full'}, 
      { path: 'rccc/settings/business-unit', redirectTo: 'app/settings/business-unit', pathMatch: 'full'},
      { path: 'settings/language', redirectTo: 'app/settings/language', pathMatch: 'full' }, 
      { path: 'settings', redirectTo: 'app/settings/language', pathMatch: 'full' },
      { path: 'app', 
        component: AppComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: TestComponent },
          { //For lazy loading
            path: 'rccc/overall-capacity',
            loadChildren: './views/offer-enablement-admin/offer-enablement-admin.module#OfferEnablementAdminModule',
            data: {
              rol: 'admin'
            },
          },
          {
            path: 'rccc/distributed-capacity',
            loadChildren: './views/offer-enablement-admin/offer-enablement-admin.module#OfferEnablementAdminModule',
            data: {
              rol: 'planner'
            },
          },
          {
            path: 'rccc/availability-inquiries',
            loadChildren: './views/daily-plant-capacity/daily-plant-capacity.module#DailyPlantCapacityModule',
          },
          {
            path: 'staging',
            component: StagingComponent,
          },
          {
            path: 'rccc/flco/fleet-catalog',
            loadChildren: './views/catalogs/fleet-type/fleet-type.module#FleetTypeModule',
          },
          {
            path: 'rccc/flco/fleet-coverage',
            loadChildren: './views/catalogs/fleet-coverage/fleet-coverage.module#FleetCoverageModule',
          },
          {
            path: 'rccc/flco/fleet-business-unit',
            loadChildren: './views/catalogs/fleet-type-business-unit/fleet-type-business-unit.module#FleetTypeBusinessUnitModule',
          },
          {
            path: 'rccc/flco/fleet-capacity',
            loadChildren: './views/catalogs/daily-fleet-capacity/daily-fleet-capacity.module#DailyFleetCapacityModule',
          },
          {
            path: 'noaccess',
            loadChildren: './views/no-access/no-access.module#NoAccessModule',
          },
          {
            path: 'rccc/index-dashboard',
            loadChildren: './views/dashboard/dashboard.module#DashboardModule',
          },
          {
            path: 'rccc/grco/holidays',
            loadChildren: './views/settings/holidays/holidays.module#HolidaysModule',
          }, 
          {
            path: 'settings/language',
            loadChildren: './views/settings/language/language.module#LanguageModule',
          }, 
          {
            path: 'settings/country',
            loadChildren: './views/settings/country-settings/country-settings.module#CountrySettingsModule',
          }, 
          {
            path: 'settings/business-unit',
            loadChildren: './views/settings/bussines-unit-settings/bussines-unit-settings.module#BussinesUnitSettingsModule',
          }
        ]
      },
      { path: '**', redirectTo: 'app' }
    ])
  ],
  declarations: [StartComponent, AppComponent, TestComponent, LoginComponent, StagingComponent],
  bootstrap: [StartComponent]
};
export class AppModuleShared { }
