import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CmxCoreCommonModule, AuthGuard } from '@cemex-core/angular-services-v7';
import { CmxNavHeaderModule } from '@cemex/cmx-nav-header-v7';
import { CmxSidebarModule } from '@cemex/cmx-sidebar-v7';
import { CmxButtonModule } from '@cemex/cmx-button-v4';
import { CmxDropdownModule } from '@cemex/cmx-dropdown-v4';
import { CmxCheckboxModule } from '@cemex/cmx-checkbox-v4';
import { CmxTableModule } from '@cemex/cmx-table-v7';
import { CmxDialogModule } from '@cemex/cmx-dialog-v7';
import { CmxPanelCardModule } from '@cemex/cmx-panel-card-v1/dist';
import { CmxDatepickerModule } from '@cemex/cmx-datepicker-v4';
// import { CmxCapacityTableModule } from '@cemex/cmx-capacity-table-v2';
import { CmxDataTableModule } from '@cemex/cmx-datatable-v1';
import { CmxChartModule } from '@cemex/cmx-chart-v1';
import { AlertModule, AlertService } from '@cemex/cmx-alert-v7';
import { FormatterService } from '@cemex-core/angular-localization-v7';


export const lazySharedConfig: NgModule = {
  providers: [FormatterService, AlertService],
  imports: [
    FlexLayoutModule,
    CmxCoreCommonModule,
    // CmxCapacityTableModule,
    CmxChartModule,
    CmxDataTableModule,
    CmxTableModule,
    CmxDialogModule,
    CmxButtonModule,
    CmxDatepickerModule,
    AlertModule,
    CmxDropdownModule,
  ],
  declarations: [],
  bootstrap: []
};
export class LazyModuleShared { }
